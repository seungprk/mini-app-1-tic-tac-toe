class App {
  constructor(ele) {
    // Vars
    this.ele = ele;
    this.currentPlayer = 'x';
    this.hasEnded = false;

    var table = this.ele.querySelector('table');
    this.createBoardDOM(table);
    this.board = this.createBoard();

    // Handlers
    var resetButton = this.ele.querySelector('button');
    resetButton.addEventListener('click', this.reset.bind(this));
  }

  createCellDOM(row, col) {
    var newCell = window.document.createElement('th');
    newCell.textContent = '-';
    newCell.addEventListener('click', this.handleClick.bind(this, row, col, newCell));
    return newCell;
  }

  createBoardDOM(table) {
    for (var i = 0; i < 3; i++) {
      var newRow = window.document.createElement('tr');
      table.appendChild(newRow);
      for (var j = 0; j < 3; j++) {
        var newCell = this.createCellDOM(i, j);
        newRow.appendChild(newCell);
      }
    }
  }

  createBoard() {
    return [['-', '-', '-'], 
            ['-', '-', '-'], 
            ['-', '-', '-']];
  }

  handleClick(row, col, newCell) {
    if (this.hasEnded === false && this.board[row][col] !== 'x' && this.board[row][col] !== 'o') { 
      this.setPiece(row, col, newCell);

      var nextPlayer = this.currentPlayer === 'x' ? 'o' : 'x'
      this.setCurrentPlayer(nextPlayer);

      this.checkWinner();
    }
  }

  setPiece(row, col, cell) {
    var selectChar = this.currentPlayer === 'x' ? 'x' : 'o';
    this.board[row][col] = selectChar;
    cell.textContent = selectChar;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
    this.ele.querySelector('.current-player-name').textContent = player;
  }

  checkWinner() {
    var results = [];

    // Check row results
    this.board.forEach(function(row) {
      var rowResult = row.reduce(function(accum, cell) {
        return accum + cell
      }, '');
      results.push(rowResult);
    });

    // Check column results
    for (var i = 0; i < 3; i++) {
      var colResult = '';
      for (var j = 0; j < 3; j++) {
        colResult += this.board[j][i];
      }
      results.push(colResult);
    }

    // Check left diagonal results
    var leftDiagResult = this.board[0][0] + this.board[1][1] + this.board[2][2];
    results.push(leftDiagResult);

    // Check right diagonal results
    var rightDiagResult = this.board[0][2] + this.board[1][1] + this.board[2][0];
    results.push(rightDiagResult);

    // Check if board is full
    var straightBoard = ''
    for (var i = 0; i < 3; i++) {
      straightBoard += results[i];
    }
    if (straightBoard.indexOf('-') === -1) {
      this.setWinner('-');
    }

    // Set winner
    results.forEach(function(result) {
      if (result === 'xxx') {
        this.setWinner('x');
      } else if (result === 'ooo') {
        this.setWinner('o');
      }
    }.bind(this));
  }

  setWinner(winner) {
    this.hasEnded = true;
    if (winner === '-') {
      this.ele.querySelector('.current-winner').textContent = 'It\'s a tie!';
    } else {
      this.ele.querySelector('.current-winner').textContent = 'Winner is ' + winner + '!';
    }
  }

  reset() {
    this.setCurrentPlayer('x');
    this.hasEnded = false;
    this.ele.querySelector('.current-winner').textContent = '';

    // Reset board
    this.board = this.createBoard();
    var table = this.ele.querySelector('table');
    while (table.hasChildNodes()) {
      table.removeChild(table.firstChild);
    }
    this.createBoardDOM(table);
  }
}

window.onload = function() {
  window.app = new App(window.document.querySelector('.app'));
};