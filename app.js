class App {
  constructor(ele) {
    this.ele = ele;
    this.table = this.ele.querySelector('table');
    this.board = this.createBoard(this.table);
    this.currentPlayer = 'x';
    this.hasEnded = false;

    var resetButton = this.ele.querySelector('button');
    resetButton.addEventListener('click', this.reset.bind(this));

    console.log('app created with dom node', this.ele);
  }

  createCell() {
    var newCell = window.document.createElement('th');

    newCell.textContent = '-';
    newCell.addEventListener('click', this.handleClick.bind(this, newCell));

    return newCell;
  }

  createBoard(table) {
    var board = [[], [], []];

    for (var i = 0; i < 3; i++) {
      var newRow = window.document.createElement('tr');
      table.appendChild(newRow);
      for (var j = 0; j < 3; j++) {
        var newCell = this.createCell(i, j, board);
        newRow.appendChild(newCell);
        board[i].push(newCell);
      }
    }

    return board;
  }

  handleClick(newCell) {
    if (this.hasEnded === false && newCell.textContent !== 'x' && newCell.textContent !== 'o') { 
      this.setPiece(newCell);

      var nextPlayer = this.currentPlayer === 'x' ? 'o' : 'x'
      this.setCurrentPlayer(nextPlayer);

      this.checkWinner();
    }
  }

  setPiece(cell) {
    cell.textContent = this.currentPlayer === 'x' ? 'x' : 'o';
  }

  setCurrentPlayer(player) {
    this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    this.ele.querySelector('.current-player-name').textContent = this.currentPlayer;
  }

  checkWinner() {
    var results = [];

    // Check row results
    this.board.forEach(function(row) {
      var rowResult = row.reduce(function(accum, cell) {
        return accum + cell.textContent
      }, '');
      results.push(rowResult);
    });

    // Check column results
    for (var i = 0; i < 3; i++) {
      var colResult = '';
      for (var j = 0; j < 3; j++) {
        colResult += this.board[j][i].textContent;
      }
      results.push(colResult);
    }

    // Check left diagonal results
    var leftDiagResult = this.board[0][0].textContent + this.board[1][1].textContent + this.board[2][2].textContent;
    results.push(leftDiagResult);

    // Check right diagonal results
    var rightDiagResult = this.board[0][2].textContent + this.board[1][1].textContent + this.board[2][0].textContent;
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

    // Clear board
    this.board.forEach(function(row) {
      row.forEach(function(cell) {
        cell.textContent = '-';
      }.bind(this));
    }.bind(this));
  }
}

window.onload = function() {
  window.app = new App(window.document.querySelector('.app'));
};