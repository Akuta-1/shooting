import * as PIXI from 'pixi.js';

export class Bacterium {
  public sprite: PIXI.Sprite;
  public health: number;
  public speed: number;
  public attackPower: number;
  public attackRange: number;
  public growthRate: number;
  public radius: number; // 細菌の半径

  constructor(x: number, y: number, app: PIXI.Application) {
    this.health = 10;
    this.speed = 1;
    this.attackPower = 1;
    this.attackRange = 50;
    this.growthRate = 0.01; // 1フレームあたりの増殖率（仮）
    this.radius = 5; // 半径5

    // 細菌のグラフィックを作成
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x00ff00); // 緑色
    graphics.drawCircle(0, 0, this.radius);
    graphics.endFill();

    // グラフィックをテクスチャとしてスプライトを作成
    const texture = app.renderer.generateTexture(graphics);

    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5); // 中心をアンカーポイントにする
    this.sprite.x = x;
    this.sprite.y = y;
  }

  update(delta: number) {
    // 細菌の移動ロジック（ランダムな方向へ移動）
    this.sprite.x += (Math.random() - 0.5) * this.speed * delta * 2;
    this.sprite.y += (Math.random() - 0.5) * this.speed * delta * 2;

    // 画面外に出ないように制限（試験管のサイズ600x600に合わせる）
    if (this.sprite.x < this.radius) this.sprite.x = this.radius;
    if (this.sprite.x > 600 - this.radius) this.sprite.x = 600 - this.radius;
    if (this.sprite.y < this.radius) this.sprite.y = this.radius;
    if (this.sprite.y > 600 - this.radius) this.sprite.y = 600 - this.radius;
  }

  // 攻撃ロジック（最も近い敵を自動攻撃）
  // TODO: 敵のリストを受け取り、最も近い敵を判定して攻撃するロジックを実装
  attack() {
    // 弾を発射する処理など
  }
}
