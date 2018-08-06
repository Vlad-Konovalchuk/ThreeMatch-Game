var ThreeMatch = ThreeMatch || {};



ThreeMatch.game = new Phaser.Game(360, 640, Phaser.AUTO);


ThreeMatch.game.state.add('Boot', ThreeMatch.BootState);
ThreeMatch.game.state.add('Preload', ThreeMatch.PreloadState);
ThreeMatch.game.state.add('Game', ThreeMatch.GameState);



ThreeMatch.game.state.start('Boot');