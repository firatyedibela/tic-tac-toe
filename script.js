function Cell() {
  let value = null;

  // Reach the cell's value
  const getValue = () => value;

  // Change the cell's value
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

  // Return board with values
  const getBoardWithValues = () => board.map((row) => row.map((cell) => cell.getValue()));

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
  return { printBoard, makeMove, getBoard, getBoardWithValues }
}

function GameController() {
  playerOneName = "Player 1";
  playerTwoName = "Player 2";
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'x',
    },
    {
      name: playerTwoName,
      token: 'o',
    }
  ];

  let activePlayer = players[0];

  const checkForWinner = () => {
    const boardWithMoves = board.getBoardWithValues();

    // Check rows
    for (let i = 0; i < 3; i++) {
      if (boardWithMoves[i][0] === activePlayer.token &&
          boardWithMoves[i][1] === activePlayer.token &&
          boardWithMoves[i][2] === activePlayer.token
        ) {
        return 'winner';
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (boardWithMoves[0][i] === activePlayer.token &&
          boardWithMoves[1][i] === activePlayer.token &&
          boardWithMoves[2][i] === activePlayer.token
        ) {   
        return 'winner';
      }
    }

    // Check diagonals
    if (
      (
        boardWithMoves[0][0] === activePlayer.token &&
        boardWithMoves[1][1] === activePlayer.token &&
        boardWithMoves[2][2] === activePlayer.token
      ) || (
        boardWithMoves[0][2] === activePlayer.token &&
        boardWithMoves[1][1] === activePlayer.token &&
        boardWithMoves[2][0] === activePlayer.token
      )
    ) { 
      return 'winner';
    }

    // Convert 2d array into 1d to iterate with 1 loop
    const allCells = boardWithMoves.flat();
    // If a cell is null, can't be a tie
    for (let i = 0; i < allCells.length; i++) {
      if (allCells[i] === null) {
        return;
      }
    }

    return 'tie';
  }
  
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn!`);
  };

  const playRound = (row, column) => {
    board.makeMove(row, column, activePlayer.token);
    
    if(checkForWinner() === 'winner') {
      console.log(`${activePlayer.name} has won the game!`);
      board.printBoard();
      return;
    } 
    else if (checkForWinner() === 'tie') {
      console.log('Tie! Nobody wins.')
      board.printBoard();
      return;
    }

    switchActivePlayer();
    printNewRound();
  };

  printNewRound();

  return { playRound };
}

const game = GameController();