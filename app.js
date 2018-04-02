class App {
  constructor(ele) {
    this.ele = ele;
    this.table = this.ele.querySelector('table');
    this.board = this.createBoard(this.table);
    this.currentPlayer = 'x';
    this.hasWon = false;

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
    if (this.hasWon === false && newCell.textContent !== 'x' && newCell.textContent !== 'o') { 
      newCell.textContent = this.currentPlayer === 'x' ? 'x' : 'o'
      this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x'
      this.checkWinner();
    }
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


    results.forEach(function(result) {
      if (result === 'xxx') {
        this.setWinner('x');
      } else if (result === 'ooo') {
        this.setWinner('o');
      }
    }.bind(this));
  }

  setWinner(winner) {
    this.hasWon = true;
    this.ele.querySelector('.current-winner').textContent = 'Winner is ' + winner + '!'
  }

  reset() {
    console.log('TODO: app reset');
  }
}

window.onload = function() {
  window.app = new App(window.document.querySelector('.app'));
};