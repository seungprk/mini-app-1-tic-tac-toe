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

class GameState {
  constructor(startPlayer) {
    this.currentPlayer = startPlayer || 'x';
    this.winner = null;
    this.winsX = 0;
    this.winsO = 0;
  }

  setWinner(winner) {
    this.winner = winner;
    if (winner === 'x') {
      this.winsX++;
    } else if (winner === 'o') {
      this.winsO++;
    }
  }

  togglePlayer() {
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
  }

  getWinner() {
    return this.winner;
  }

  getPlayer() {
    return this.currentPlayer;
  }

  getWinsX() {
    return this.winsX;
  }

  getWinsO() {
    return this.winsO;
  }
}

class App {
  constructor(len, ele) {
    // DOM related
    this.ele = ele;
    var table = this.ele.querySelector('table');
    this.createBoardDOM(table);
    this.setupPlayerNames();

    // Separation of concerns
    this.board = new Board(len);
    this.gameState = new GameState();

    // Handlers
    var resetButton = this.ele.querySelector('button');
    resetButton.addEventListener('click', this.reset.bind(this));
  }

  setupPlayerNames() {
    var playerOneName = prompt('Please enter name for Player 1 (x):');
    var playerTwoName = prompt('Please enter name for Player 2 (o):');

    this.ele.querySelector('.player-one-name').textContent = playerOneName;
    this.ele.querySelector('.player-two-name').textContent = playerTwoName;

    this.ele.querySelector('.wins-player-one').textContent = playerOneName + ': ';
    this.ele.querySelector('.wins-player-two').textContent = playerTwoName + ': ';
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
    if (this.gameState.getWinner() === null && this.board.canMakeMove(row, col)) {
      this.setPiece(row, col, cellDOM);

      var currWinner = this.board.getWinner();
      if (currWinner) {
        this.setWinner(currWinner);
        this.setWinnerCount(currWinner);
      } else if (this.board.boardIsFull()) {
        this.setWinner('-');
        this.gameState.togglePlayer();
        this.setCurrentPlayer(this.gameState.getPlayer());
      } else {
        this.gameState.togglePlayer();
        this.setCurrentPlayer(this.gameState.getPlayer());
      }
    }
  }

  setPiece(row, col, cellDOM) {
    var selectChar = this.gameState.getPlayer();
    this.board.setCell(row, col, selectChar);
    cellDOM.textContent = selectChar;
  }

  setCurrentPlayer(player) {
    this.ele.querySelector('.current-player-name').textContent = player;
  }

  setWinner(winner) {
    this.gameState.setWinner(winner);

    if (winner === '-') {
      this.ele.querySelector('.current-winner').textContent = 'It\'s a tie!';
    } else {
      this.ele.querySelector('.current-winner').textContent = 'Winner is ' + winner + '!';
    }
  }

  setWinnerCount(winner) {
    if (winner === 'x') {
      this.ele.querySelector('.wins-x').textContent = this.gameState.getWinsX();
    } else if (winner === 'o') {
      this.ele.querySelector('.wins-o').textContent = this.gameState.getWinsO();
    }
  }

  reset() {
    this.setCurrentPlayer(this.gameState.getPlayer());
    this.ele.querySelector('.current-winner').textContent = '';
    this.gameState.setWinner(null);

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