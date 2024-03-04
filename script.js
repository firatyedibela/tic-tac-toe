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
  const getBoard = () => {
    return board;
  };
  

  // Provide the interface to interact with the board
  return { printBoard, makeMove, getBoard, getBoardWithValues }
}

function GameController() {
  const board = Gameboard();
  let result = null;

  const getResult = () => result;

  const players = [
    {
      name: "Player 1",
      token: 'X',
    },
    {
      name: "Plyar 2",
      token: 'O',
    }
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn!`);
  };

  const playRound = (row, column) => {
    board.makeMove(row, column, activePlayer.token);
    
    if(checkForWinner() === 'winner') {
      console.log(`${activePlayer.name} has won the game!`);
      board.printBoard();

      result = 'winner';
      return;
    } 
    else if (checkForWinner() === 'tie') {
      console.log('Tie! Nobody wins.')
      board.printBoard();

      result = 'tie';
      return;
    }

    switchActivePlayer();
    printNewRound();
  };

  printNewRound();

  return { 
    playRound,
    getActivePlayer, 
    getBoard: board.getBoard, 
    getResult,
  };
}


function Display() {
  let game = GameController();
  const divTurn = document.querySelector('.turn');
  const divBoard = document.querySelector('.board');

  const playRoundHandler = function(event) {
    game.playRound(event.target.dataset.row, event.target.dataset.col);
    renderGameScreen();
    if (game.getResult()) {
      renderGameOverScreen(game.getResult());
      resetEventListeners();
    }   
  }

  const resetEventListeners = () => {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.removeEventListener('click', playRoundHandler);
    });
  }

  const renderGameScreen = function() {
    // Clear the board first
    divBoard.textContent = "";

    // Get the latest active player and board status
    const activePlayer = game.getActivePlayer();
    const board = game.getBoard();
    console.log(board.map(row => row.map(cell => cell.getValue())));
    

    // Display player turn
    divTurn.textContent = `${activePlayer.name}'s turn`;

    // Display board
    // Add cells to divBoard based on board
    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const cellBtn = document.createElement('button');
        // We'll need cell's coordinates for event handlers
        cellBtn.dataset.row = rowIdx;
        cellBtn.dataset.col = colIdx;
        // Add class to target in css
        cellBtn.classList.add('cell');
      
        cellBtn.textContent = cell.getValue();

        divBoard.appendChild(cellBtn);
      });
    });

    // Add event handlers
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.addEventListener('click', playRoundHandler);
    });
  }

  const renderGameOverScreen = function(result) {
    const gameScreen = document.querySelector('.container');
    const gameOverScreen = document.querySelector('.game-over-modal');
    gameScreen.classList.add('translucent');
    gameOverScreen.classList.remove('hidden');

    const winnerText = document.querySelector('.winner');
    if (result === 'winner') {
      winnerText.textContent = `${game.getActivePlayer().name} has won the game!`;
    } else {
      winnerText.textContent = 'Tie!';
    }

    const playAgainBtn = document.querySelector('.play-again-btn');

    playAgainBtn.addEventListener('click', () => {
      gameOverScreen.classList.add('hidden');
      gameScreen.classList.remove('translucent');

      // Initialize new game
      Display();
    });

  }
  
  // Initial render
  renderGameScreen();
}

// Initialize game
Display();