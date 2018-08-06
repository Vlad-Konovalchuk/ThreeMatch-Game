var ThreeMatch = ThreeMatch || {};


ThreeMatch.Block = function (state, x, y, data) {
    Phaser.Sprite.call(this, state.game, x, y, data.asset);

    this.game = state.game;
    this.state = state;
    this.row = data.row;
    this.col = data.col;
    this.anchor.setTo(0.5);


    // input
    this.inputEnabled = true;
    this.events.onInputDown.add(state.touchBlock,this.state);
}

ThreeMatch.Block.prototype = Object.create(Phaser.Sprite.prototype);
ThreeMatch.Block.prototype.constructor = ThreeMatch.Block;


ThreeMatch.Block.prototype.reset = function (x, y, data) {
    Phaser.Sprite.prototype.reset.call(this, x, y);

    this.loadTexture(data.asset);
    this.row = data.row;
    this.col = data.col;
};

ThreeMatch.Block.prototype.kill = function () {
    this.loadTexture('deadBlock');
    this.col = null;
    this.row = null;

    this.game.time.events.add(this.state.ANIMATION_TIME, function () {
        Phaser.Sprite.prototype.kill.call(this);
    }, this)
}