function Cell() {
  let value = null;

  // To reach the cell's value
  const getValue = () => value;

  // To change the cell's value
  const addToken = (token) => {
    value = token;
  }

  return { getValue, addToken };
}

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create the 2d array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // Print the board with the cell's values to the console
  const printBoard = () => {
    const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithValues);
  };

  // Draw the cell to the given token
  const makeMove = (row, column, token) => {
    // If the cell is already filled, this is an invalid move, return
    const targetCell = board[row][column];
    if (targetCell.getValue()) {
      console.log('Invalid move!');
      return;
    }
    targetCell.addToken(token);
  }

  // Return the entire board for the UI to render
  const getBoard = () => board;

  // Provide the interface to interact with the board
  return { printBoard, makeMove, getBoard }
}

function GameController() {
  playerOneName = "Player One";
  playerTwoName = "Player Two";
  const board = Gameboard();

  const players = [
    {
      name: 'Player One',
      token: 'x',
    },
    {
      name: 'Player Two',
      token: 'o',
    }
  ];
  
  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn!`);
  };

  const playRound = (row, column) => {
    board.makeMove(row, column, activePlayer.token);
    /* 
      Check for winner
    */

    switchActivePlayer();
    printNewRound();
  };

  printNewRound();

  return { playRound };
}

const game = GameController();