import * as PIXI from 'pixi.js';

export class Enemy {
  public sprite: PIXI.Sprite;
  public health: number;
  public speed: number;
  public attackPower: number;
  public size: number; // 敵のサイズ（四角形の一辺の長さ）

  constructor(x: number, y: number, app: PIXI.Application) {
    this.health = 20;
    this.speed = 0.5;
    this.attackPower = 5;
    this.size = 10; // 10x10の四角形

    // 敵のグラフィックを作成
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff0000); // 赤色
    graphics.drawRect(0, 0, this.size, this.size);
    graphics.endFill();

    // グラフィックをテクスチャとしてスプライトを作成
    const texture = app.renderer.generateTexture(graphics);

    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5); // 中心をアンカーポイントにする
    this.sprite.x = x;
    this.sprite.y = y;
  }

  update(delta: number) {
    // 敵の移動ロジック（仮: 細菌に向かって移動するなど）
    // TODO: 細菌の位置を追跡して移動するロジックを実装
    this.sprite.x += (Math.random() - 0.5) * this.speed * delta;
    this.sprite.y += (Math.random() - 0.5) * this.speed * delta;

    // 画面外に出ないように制限（試験管のサイズ600x600に合わせる）
    if (this.sprite.x < this.size / 2) this.sprite.x = this.size / 2;
    if (this.sprite.x > 600 - this.size / 2) this.sprite.x = 600 - this.size / 2;
    if (this.sprite.y < this.size / 2) this.sprite.y = this.size / 2;
    if (this.sprite.y > 600 - this.size / 2) this.sprite.y = 600 - this.size / 2;
  }

  // 攻撃ロジック
  attack() {
    // 細菌を攻撃する処理など
  }
}
