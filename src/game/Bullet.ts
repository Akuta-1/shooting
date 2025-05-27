import { Application, Sprite, Graphics, RenderTexture } from 'pixi.js';
import { Enemy } from './Enemy'; // 敵クラスをインポート

export class Bullet {
  public sprite: Sprite;
  public speed: number;
  public damage: number;
  private target: Enemy | null = null;
  private app: Application;

  constructor(x: number, y: number, damage: number, speed: number, app: Application) {
    this.damage = damage;
    this.speed = speed;
    this.app = app;

    // 弾のグラフィックを作成（仮: 小さな円）
    const graphics = new Graphics();
    graphics.beginFill(0xffff00); // 黄色
    graphics.drawCircle(0, 0, 2); // 半径2
    graphics.endFill();

    const texture = RenderTexture.create({
      width: 4,
      height: 4,
    });
    this.app.renderer.render(graphics, { renderTexture: texture });

    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;
  }

  setTarget(target: Enemy) {
    this.target = target;
  }

  update(delta: number): boolean {
    if (!this.target || this.target.health <= 0) {
      // ターゲットがいないか、倒された場合は弾を削除
      return true; // 削除フラグ
    }

    // ターゲットに向かって移動
    const angle = Math.atan2(this.target.sprite.y - this.sprite.y, this.target.sprite.x - this.sprite.x);
    this.sprite.x += Math.cos(angle) * this.speed * delta;
    this.sprite.y += Math.sin(angle) * this.speed * delta;

    // 衝突判定（簡易的な円と四角形の衝突判定）
    const dx = this.sprite.x - this.target.sprite.x;
    const dy = this.sprite.y - this.target.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.sprite.width / 2 + this.target.size / 2) { // 衝突
      this.target.health -= this.damage;
      return true; // 削除フラグ
    }

    // 画面外に出た場合も削除（試験管のサイズ600x600に合わせる）
    if (this.sprite.x < 0 || this.sprite.x > 600 || this.sprite.y < 0 || this.sprite.y > 600) {
      return true; // 削除フラグ
    }

    return false; // 削除しない
  }
}
