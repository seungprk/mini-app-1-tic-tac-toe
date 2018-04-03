class Board {
  constructor(len) {
    this.len = len;
    this.cells = '-'.repeat(len * len).split('');
  }

  canMakeMove(row, col) {
    return !this.boardIsFull() && this.getCell(row, col) === '-';
  }

  boardIsFull() {
    return !this.cells.includes('-');
  }

  getWinner() {
    var results = [];

    // Check row results
    for (var i = 0; i < this.len; i++) {
      var rowResult = '';
      for (var j = 0; j < this.len; j++) {
        rowResult += this.getCell(i, j);
      }
      results.push(rowResult);
    }

    // Check column results
    for (var i = 0; i < this.len; i++) {
      var colResult = '';
      for (var j = 0; j < this.len; j++) {
        colResult += this.getCell(j, i);
      }
      results.push(colResult);
    }

    // Check left diagonal results
    var leftDiagResult = '';
    for (var i = 0; i < this.len; i++) {
      leftDiagResult += this.getCell(i, i);
    }
    results.push(leftDiagResult);

    // Check right diagonal results
    var rightDiagResult = '';
    for (var i = 0; i < this.len; i++) {
      rightDiagResult += this.getCell(i, this.len - 1 - i);
    }
    results.push(rightDiagResult);

    for (var i = 0; i < results.length; i++) {
      if (results[i] === 'xxx') {
        return 'x';
      } else if (results[i] === 'ooo') {
        return 'o';
      }
    }

    return null;
  }

  getCell(row, col) {
    var index = row * this.len + col
    return this.cells[index];
  }

  setCell(row, col, char) {
    var index = row * this.len + col
    this.cells[index] = char;
  }
}

class App {
  constructor(len, ele) {
    // Vars
    this.ele = ele;
    this.currentPlayer = 'x';
    this.winner = null;

    var table = this.ele.querySelector('table');
    this.createBoardDOM(table);
    this.board = new Board(len);

    // Handlers
    var resetButton = this.ele.querySelector('button');
    resetButton.addEventListener('click', this.reset.bind(this));
  }

  createCellDOM(row, col) {
    var newCell = window.document.createElement('td');
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

  handleClick(row, col, cellDOM) {
    if (this.winner === null && this.board.canMakeMove(row, col)) {
      this.setPiece(row, col, cellDOM);

      var nextPlayer = this.currentPlayer === 'x' ? 'o' : 'x'
      this.setCurrentPlayer(nextPlayer);

      if (this.winner = this.board.getWinner()) {
        this.setWinner(this.winner);
      } else if (this.board.boardIsFull()) {
        this.setWinner('-');
      }
    }
  }

  setPiece(row, col, cellDOM) {
    var selectChar = this.currentPlayer === 'x' ? 'x' : 'o';
    this.board.setCell(row, col, selectChar);
    cellDOM.textContent = selectChar;
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
    this.ele.querySelector('.current-player-name').textContent = player;
  }

  setWinner(winner) {
    if (winner === '-') {
      this.ele.querySelector('.current-winner').textContent = 'It\'s a tie!';
    } else {
      this.ele.querySelector('.current-winner').textContent = 'Winner is ' + winner + '!';
    }
  }

  reset() {
    this.setCurrentPlayer(this.winner || 'x');
    this.ele.querySelector('.current-winner').textContent = '';
    this.winner = null;

    // Reset board
    this.board = new Board(this.board.len);
    var table = this.ele.querySelector('table');
    while (table.hasChildNodes()) {
      table.removeChild(table.firstChild);
    }
    this.createBoardDOM(table);
  }
}

window.onload = function() {
  window.app = new App(3, window.document.querySelector('.app'));
};