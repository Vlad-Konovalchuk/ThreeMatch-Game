var ThreeMatch = ThreeMatch || {};

ThreeMatch.Board = function (state, rows, cols, blockVariations) {

    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;

    this.grid = [];
    var i, j;
    // create rows for game table------------
    for (i = 0; i < rows; i++) {
        this.grid.push([]);
        // create columns for game table-------------
        for (j = 0; j < cols; j++) {
            this.grid[i].push(0);
        }
    }

    // Create reserve blocks
    this.reserveGrid = []

    this.RESERVE_ROW = rows;
    // create reserve rows-------
    for (i = 0; i < this.RESERVE_ROW; i++) {
        this.reserveGrid.push([]);
        // create resrve columns-----
        for (j = 0; j < cols; j++) {
            this.reserveGrid[i].push(0);
        }
    }
    // creating Grid for game 
    this.populateGrid();
    this.populaReserveteGrid();
};

ThreeMatch.Board.prototype.populateGrid = function () {
    var i, j, variation;
    for (i = 0; i < this.rows; i++) {
        for (j = 0; j < this.cols; j++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1;
            this.grid[i][j] = variation;
        }
    }

    // if any chains - repopulate
    var chains = this.findAllChains();
    if (chains.length > 0) {
        this.populateGrid();
    }
}

ThreeMatch.Board.prototype.populaReserveteGrid = function () {
    var i, j, variation;
    for (i = 0; i < this.RESERVE_ROW; i++) {
        for (j = 0; j < this.cols; j++) {
            variation = Math.floor(Math.random() * this.blockVariations) + 1;
            this.reserveGrid[i][j] = variation;
        }
    }
}


ThreeMatch.Board.prototype.consolelog = function () {
    var i, j, variation;
    var prettyString = '';
    for (i = 0; i < this.RESERVE_ROW; i++) {
        prettyString += '\n'
        for (j = 0; j < this.cols; j++) {
            prettyString += '' + this.reserveGrid[i][j]
        }
    }
    prettyString += '\n'

    for (j = 0; j < this.cols; j++) {
        prettyString += '---';
    }

    for (i = 0; i < this.rows; i++) {
        prettyString += '\n'
        for (j = 0; j < this.cols; j++) {
            prettyString += '' + this.grid[i][j]

        }
    }

}


ThreeMatch.Board.prototype.swap = function (source, target) {
    var temp = this.grid[target.row][target.col];
    this.grid[target.row][target.col] = this.grid[source.row][source.col];
    this.grid[source.row][source.col] = temp;

    var tempPos = {row:source.row,col:source.col};
    source.row = target.row;
    source.col = target.col;

    target.row = tempPos.row;
    target.col = tempPos.col;
}


ThreeMatch.Board.prototype.checkAdjacent = function (source, target) {
    var differenceRow = Math.abs(source.row - target.row)
    var differenceCol = Math.abs(source.col - target.col)

    var isAdjacent = (differenceRow === 1 && differenceCol === 0) || (differenceRow === 0 && differenceCol === 1);
    return isAdjacent;
}



ThreeMatch.Board.prototype.isChained = function (block) {
    var isChained = false;
    var variation = this.grid[block.row][block.col];
    var row = block.row;
    var col = block.col;
    //left
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col - 2]) {
        isChained = true;
    }
    //right
    if (variation == this.grid[row][col + 1] && variation == this.grid[row][col + 2]) {
        isChained = true;
    }
    // top
    if (this.grid[row - 2]) {
        if (variation == this.grid[row - 1][col] && variation == this.grid[row - 2][col]) {
            isChained = true;
        }
    }
    // bottom
    if (this.grid[row + 2]) {
        if (variation == this.grid[row + 1][col] && variation == this.grid[row + 2][col]) {
            isChained = true;
        }
    }

    // center - horizontaly
    if (variation == this.grid[row][col - 1] && variation == this.grid[row][col + 1]) {
        isChained = true;
    }
    // center - verticall
    if (this.grid[row + 1] && this.grid[row - 1]) {
        if (variation == this.grid[row - 1][col] && variation == this.grid[row + 1][col]) {
            isChained = true;
        }
    }
    return isChained;
}

ThreeMatch.Board.prototype.findAllChains = function () {
    var chained = [];
    var i, j;
    for (i = 0; i < this.rows; i++) {
        for (j = 0; j < this.cols; j++) {
            if (this.isChained({
                    row: i,
                    col: j
                })) {
                chained.push({
                    row: i,
                    col: j
                })
            }
        }
    }

    console.log(chained);
    return chained;
}

ThreeMatch.Board.prototype.clearChains = function () {
    var chainedBlocks = this.findAllChains();
    chainedBlocks.forEach(function (block) {
        this.grid[block.row][block.col] = 0;

        // kill the cells(block)
        this.state.getBlockFromColRow(block).kill();
    }, this)
};
// Drop block in the main grid from one position to another, the source is set to zero
ThreeMatch.Board.prototype.dropBlock = function (sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0;

    this.state.dropBlock(sourceRow, targetRow, col);
}
// Drop block in the  reserve grid from one position to another, the source is set to zero
ThreeMatch.Board.prototype.reserveDropBlock = function (sourceRow, targetRow, col) {
    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0;

    this.state.dropReserveBlock(sourceRow, targetRow, col);

}

ThreeMatch.Board.prototype.updateGrid = function () {
    var i, j, k, foundBlock;
    // find zero in main grid
    for (i = this.rows - 1; i >= 0; i--) {
        for (j = 0; j < this.cols; j++) {
            if (this.grid[i][j] === 0) {
                foundBlock = false;

                // climb up in the main grid
                for (k = i - 1; k >= 0; k--) {
                    if (this.grid[k][j] > 0) {
                        this.dropBlock(k, i, j);
                        foundBlock = true;
                        break;
                    }
                }
                // climb up in reserve grid
                if (!foundBlock) {
                    for (k = this.RESERVE_ROW - 1; k >= 0; k--) {
                        if (this.reserveGrid[k][j] > 0) {
                            this.reserveDropBlock(k, i, j);
                            break;
                        }
                    }
                }
            }
        }
    }
    // repopulate reserve grid
    this.populaReserveteGrid();
}
