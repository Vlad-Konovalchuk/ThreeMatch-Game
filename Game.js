var ThreeMatch = ThreeMatch || {};

ThreeMatch.GameState = {
    init: function () {
        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        this.NUM_VARIATIONS = 6;
        this.BLOCK_SIZE = 35;
        this.ANIMATION_TIME = 500;
    },
    create: function () {

        this.background = this.add.sprite(0, 0, 'background');
        this.blocks = this.add.group();


        this.board = new ThreeMatch.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
        this.board.consolelog();

        this.drawBoard();

        // var block1 = this.blocks.children[10];
        // var block2 = this.blocks.children[11];

        // this.swapBlocks(block1, block2)
    },

    createBlock: function (x, y, data) {
        var block = this.blocks.getFirstExists(false);

        if (!block) {
            block = new ThreeMatch.Block(this, x, y, data);
            this.blocks.add(block);
        } else {
            block.reset(x, y, data);
        }
        return block;
    },

    drawBoard: function () {
        var i, j, block, square, x, y, data;

        var squareBitMap = this.add.bitmapData(this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);
        squareBitMap.ctx.fillStyle = '#000';
        squareBitMap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);

        for (i = 0; i < this.NUM_ROWS; i++) {
            for (j = 0; j < this.NUM_COLS; j++) {
                x = 36 + j * (this.BLOCK_SIZE + 6);
                y = 150 + i * (this.BLOCK_SIZE + 6);

                square = this.add.sprite(x, y, squareBitMap);
                square.anchor.setTo(0.5);
                square.alpha = 0.2;

                this.createBlock(x, y, {
                    asset: 'ball' + this.board.grid[i][j],
                    row: i,
                    col: j
                })
            }
        }
        this.game.world.bringToTop(this.blocks);
    },

    getBlockFromColRow: function (position) {
        var foundBlock;

        this.blocks.forEachAlive(function (block) {
            if (block.row === position.row && block.col === position.col) {
                foundBlock = block;
            }
        }, this)
        return foundBlock;
    },

    dropBlock: function (sourceRow, targetRow, col) {
        var block = this.getBlockFromColRow({
            row: sourceRow,
            col: col
        });
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        block.row = targetRow;

        var blockMove = this.game.add.tween(block);
        blockMove.to({
            y: targetY
        }, this.ANIMATION_TIME);
        blockMove.start();
    },
    dropReserveBlock: function (sourceRow, targetRow, col) {
        var x = 36 + col * (this.BLOCK_SIZE + 6);
        var y = -(this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow * (this.BLOCK_SIZE + 6);

        var block = this.createBlock(x, y, {
            asset: 'ball' + this.board.grid[targetRow][col],
            row: targetRow,
            col: col
        });
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        var blockMove = this.game.add.tween(block);
        blockMove.to({
            y: targetY
        }, this.ANIMATION_TIME);
        blockMove.start();
    },
    swapBlocks: function (block1, block2) {

        block1.scale.setTo(1)

        var block1Movement = this.game.add.tween(block1);
        block1Movement.to({
            x: block2.x,
            y: block2.y
        }, this.ANIMATION_TIME);
        block1Movement.onComplete.add(function () {
            this.board.swap(block1, block2);


            if (!this.isReversingSwap) {
                var chaines = this.board.findAllChains();

                if (chaines.length > 0) {
                    this.board.clearChains();
                    this.board.updateGrid();
                } else {
                    this.isReversingSwap = true;
                    this.swapBlocks(block1, block2);
                }
            } else {
                this.isReversingSwap = false;
                this.clearSelection();
            }
        }, this)
        block1Movement.start();

        var block2Movement = this.game.add.tween(block2);
        block2Movement.to({
            x: block1.x,
            y: block1.y
        }, this.ANIMATION_TIME)
        block2Movement.start();
    },

    touchBlock: function (block) {
        // only if screen is`t blocked

        if (this.isBoardBlocked) {
            return
        }
        if (!this.selectedBlock) {
            block.scale.setTo(1.5);

            this.selectedBlock = block;
        } else {
            this.targetBlock = block;

            if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)) {
                this.isBoardBlocked = true;

                this.swapBlocks(this.selectedBlock, this.targetBlock);
            } else {
                this.clearSelection();
            }
            this.clearSelection();
        }
    },
    clearSelection: function () {
        this.isBoardBlocked = false;
        this.selectedBlock = null;
        this.blocks.setAll('scale.x', 1);
        this.blocks.setAll('scale.y', 1);
    },

    updateBoard: function () {

    }

}