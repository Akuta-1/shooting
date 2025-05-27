"use client";

import React, { useState } from "react";
import PixiGame from "../components/PixiGame"; // PixiGameコンポーネントをインポート

// ゲームの状態を管理するEnum
enum GameState {
  TITLE,
  PLAYING,
  GAME_OVER,
  GAME_CLEAR,
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(GameState.TITLE);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-900 text-white">
      <div className="relative w-full max-w-4xl h-[calc(100vh-32px)] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* UIオーバーレイ */}
        <div className="absolute inset-0 flex flex-col">
          {gameState === GameState.TITLE && (
            <div className="flex flex-col items-center justify-center flex-grow bg-black bg-opacity-75">
              <h1 className="text-5xl font-bold mb-8 text-green-400">
                細菌増殖ローグライクシューター
              </h1>
              <button
                onClick={() => setGameState(GameState.PLAYING)}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-2xl font-bold rounded-lg shadow-lg transition duration-300"
              >
                ゲームスタート
              </button>
            </div>
          )}

          {gameState === GameState.PLAYING && (
            <PixiGame /> // PixiGameコンポーネントをレンダリング
          )}

          {(gameState === GameState.GAME_OVER ||
            gameState === GameState.GAME_CLEAR) && (
            <div className="flex flex-col items-center justify-center flex-grow bg-black bg-opacity-75">
              <h1 className="text-5xl font-bold mb-8 text-red-400">
                {gameState === GameState.GAME_OVER
                  ? "ゲームオーバー"
                  : "ゲームクリア！"}
              </h1>
              <p className="text-2xl mb-4">到達ラウンド: 1</p>
              <button
                onClick={() => setGameState(GameState.TITLE)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg shadow-lg transition duration-300"
              >
                リトライ
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
