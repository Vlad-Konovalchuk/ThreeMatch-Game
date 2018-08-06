var ThreeMatch = ThreeMatch || {};


ThreeMatch.PreloadState = {
    preload: function () {
        this.load.image('ball1', 'assets/ball-blue.png');
        this.load.image('ball2', 'assets/ball-red.png');
        this.load.image('ball3', 'assets/ball-yellow.png');
        this.load.image('ball4', 'assets/ball-green.png');
        this.load.image('ball5', 'assets/ball-pink.png');
        this.load.image('ball6', 'assets/ball-aqua.png');
        this.load.image('ball7', 'assets/ball-brown.png');
        this.load.image('ball8', 'assets/ball-orange.png');
        this.load.image('deadBlock', 'assets/deadBlock.png');

        this.load.image('background', 'assets/background.jpg')


    },
    create: function () {
        this.state.start('Game')
    }
}