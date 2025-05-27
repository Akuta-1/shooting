"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Application, Ticker } from 'pixi.js';
import { Bacterium } from '../game/Bacterium';
import { Enemy } from '../game/Enemy';
import { Bullet } from '../game/Bullet'; // Bulletクラスをインポート

interface GameState {
  round: number;
  bacteriaCount: number;
  targetBacteriaCount: number;
  researchFunds: number;
  isGameOver: boolean;
  isGameClear: boolean;
}

const PixiGame: React.FC = () => {
  const appRef = useRef<Application | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    bacteriaCount: 0,
    targetBacteriaCount: 200, // 仮の目標数
    researchFunds: 0,
    isGameOver: false,
    isGameClear: false,
  });

  const bacteriaRef = useRef<Bacterium[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]); // bulletsRefの宣言を追加

  // ゲームループをコンポーネントのトップレベルに移動し、useCallback でラップ
  const gameLoop: (delta: number, ticker: Ticker) => void = useCallback((delta, ticker) => {
    const app = appRef.current;
    if (!app) return; // appがnullの場合は処理を中断

    // ダミーで ticker を使用
    console.log(ticker.FPS);

      // 細菌の更新と増殖
      const newBacteria: Bacterium[] = [];
      bacteriaRef.current.forEach(bacterium => {
        bacterium.update(delta);

        // 細菌の増殖ロジック
        if (Math.random() < bacterium.growthRate * delta && bacteriaRef.current.length < gameState.targetBacteriaCount) {
          const newBacterium = new Bacterium(bacterium.sprite.x, bacterium.sprite.y, app);
          newBacteria.push(newBacterium);
          app.stage.addChild(newBacterium.sprite);
        }

        // 細菌の攻撃ロジック
        // 最も近い敵を見つける
        let closestEnemy: Enemy | null = null;
        let minDistance = Infinity;
        enemiesRef.current.forEach(enemy => {
          const dx = bacterium.sprite.x - enemy.sprite.x;
          const dy = bacterium.sprite.y - enemy.sprite.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance && distance <= bacterium.attackRange) {
            minDistance = distance;
            closestEnemy = enemy;
          }
        });

        // 敵が射程内にいたら弾を発射
        if (closestEnemy && Math.random() < 0.05) { // 仮の攻撃頻度
          const bullet = new Bullet(bacterium.sprite.x, bacterium.sprite.y, bacterium.attackPower, 5, app);
          bullet.setTarget(closestEnemy);
          bulletsRef.current.push(bullet);
          app.stage.addChild(bullet.sprite);
        }
      });
      bacteriaRef.current.push(...newBacteria); // 新しい細菌を追加

      // 敵の更新と削除
      const aliveEnemies: Enemy[] = [];
      enemiesRef.current.forEach(enemy => {
        enemy.update(delta);
        if (enemy.health > 0) {
          aliveEnemies.push(enemy);
        } else {
          app.stage.removeChild(enemy.sprite); // 倒された敵のスプライトを削除
        }
      });
      enemiesRef.current = aliveEnemies;

      // 弾の更新と削除
      const activeBullets: Bullet[] = [];
      bulletsRef.current.forEach((bullet: Bullet) => { // bulletに型を明示
        const shouldRemove = bullet.update(delta);
        if (shouldRemove) {
          app.stage.removeChild(bullet.sprite); // 弾のスプriteを削除
        } else {
          activeBullets.push(bullet);
        }
      });
      bulletsRef.current = activeBullets;

      // 仮の敵の生成（テスト用）
      if (enemiesRef.current.length < 3 && Math.random() < 0.01) { // 敵が3体未満でランダムに生成
        const enemy = new Enemy(
          Math.random() * app.screen.width,
          Math.random() * app.screen.height,
          app
        );
        enemiesRef.current.push(enemy);
        app.stage.addChild(enemy.sprite);
      }

      // 細菌数の更新
      setGameState(prev => ({ ...prev, bacteriaCount: bacteriaRef.current.length }));

      // ゲーム進行ロジック
      if (bacteriaRef.current.length === 0 && !gameState.isGameOver) {
        setGameState(prev => ({ ...prev, isGameOver: true }));
        console.log("Game Over!");
      }
      if (gameState.bacteriaCount >= gameState.targetBacteriaCount && !gameState.isGameClear) {
        setGameState(prev => ({ ...prev, isGameClear: true }));
        console.log("Round Clear!");
        // 次のラウンドへ移行する処理などを追加
      }
  }, [gameState.targetBacteriaCount, gameState.isGameOver, gameState.isGameClear]);

  // ゲーム初期化
  useEffect(() => {
    if (!gameContainerRef.current) return;

    const app = new Application({
      width: 600, // 試験管のサイズを仮で設定
      height: 600,
      backgroundColor: 0x1099bb,
      antialias: true,
    });
    appRef.current = app;
    if (app.view instanceof HTMLCanvasElement) {
      gameContainerRef.current.appendChild(app.view);
    } else {
      console.error("PixiJS application view is not an HTMLCanvasElement.");
      // エラーハンドリングまたは代替処理
    }

    // 初期細菌の生成（仮）
    for (let i = 0; i < 5; i++) {
      const bacterium = new Bacterium(app.screen.width / 2, app.screen.height / 2, app);
      bacteriaRef.current.push(bacterium);
      app.stage.addChild(bacterium.sprite);
    }

    app.ticker.add(gameLoop as any);

    return () => {
      app.ticker.remove(gameLoop as any);
      app.destroy(true);
      appRef.current = null;
    };
  }, [gameLoop, appRef]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-3xl mb-4">細菌増殖ローグライクシューター</h1>
      <div className="flex mb-4">
        <div className="mr-8">
          <p>ラウンド: {gameState.round}</p>
          <p>細菌数: {gameState.bacteriaCount} / {gameState.targetBacteriaCount}</p>
          <p>研究資金: {gameState.researchFunds}</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 rounded">アップグレード確認</button>
        </div>
        <div>
          <h2 className="text-xl mb-2">コマンド入力</h2>
          <button className="block px-4 py-2 bg-green-500 rounded mb-2">温度調整 (100資金)</button>
          <button className="block px-4 py-2 bg-green-500 rounded mb-2">抗生物質添加 (150資金)</button>
          <button className="block px-4 py-2 bg-green-500 rounded">栄養剤添加 (50資金)</button>
        </div>
      </div>
      <div ref={gameContainerRef} className="border-4 border-white">
        {/* Pixi.js canvas will be appended here */}
      </div>
      {gameState.isGameOver && <div className="absolute text-5xl text-red-500">GAME OVER</div>}
      {gameState.isGameClear && <div className="absolute text-5xl text-green-500">ROUND CLEAR!</div>}
    </div>
  );
};

export default PixiGame;
