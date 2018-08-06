var ThreeMatch = ThreeMatch || {};



ThreeMatch.BootState = {
    init: function () {
        this.game.stage.backgroundColor = '#fff';

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

    },
    preload: function () {
        // this.load.image('diamond', 'assets/diamonds32x5.png');
    },
    create: function () {
        this.state.start('Preload');
    }
}