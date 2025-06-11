const config = {
    type: Phaser.AUTO, // WebGL優先、ダメならCanvas
    width: 800,        // ゲーム画面の幅
    height: 600,       // ゲーム画面の高さ
    parent: 'game-container', // HTML内の描画先要素のID
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // 必要に応じて重力設定
            debug: false
        }
    },
    scene: {
        preload: preload, // アセット読み込み
        create: create,   // ゲームオブジェクト作成
        update: update    // 毎フレーム更新
    }
};

const game = new Phaser.Game(config);

function preload() {
    // ここに画像や音声ファイルなどのアセット読み込み処理を記述します
    // 例: this.load.image('sky', 'assets/sky.png');
    console.log('Preloading assets...');
}

function create() {
    // ここにゲームオブジェクトの作成や初期設定を記述します
    // 例: this.add.image(400, 300, 'sky');
    this.add.text(config.width / 2, config.height / 2, 'SynthStellar Ready!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    console.log('Game created!');
}

function update() {
    // ここに毎フレームごとの処理を記述します
    // 例: プレイヤーの移動、衝突判定など
}
