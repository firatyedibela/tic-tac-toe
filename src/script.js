import players from './players.js';
import Cell from './cell.js';


function Gameboard() {
  const board = [];

  const getBoard = () => board;

  const getBoardWithValues = () => board.map((row) => row.map((cell) => cell.getValue()));

  // Create gameboard as 2d array
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(Cell());
    }
    board.push(row);
  }

  const addMove = function(row, column, token) {
    // 0 is for fail(invalid move), 1 is for success
    if (board[row][column].getValue()) {
      return 0;
    }
    board[row][column].changeValue(token);
    return 1;
  }

  const resetBoard = function() {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.changeValue(null);
      });
    });
  }

  return { getBoard, addMove, getBoardWithValues, resetBoard }
}


function Game() {
  const board = Gameboard()
  let result = null;

  const resetGame = function() {
    result = null;
    board.resetBoard(); 
    changeTurn();
  }

  const getResult = () => result;

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  
  const changeTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const checkForWinner = () => {
    const boardWithValues = board.getBoardWithValues();
    // Win conditions
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (boardWithValues[i][0] === activePlayer.token &&
          boardWithValues[i][1] === activePlayer.token &&
          boardWithValues[i][2] === activePlayer.token
        ) {
        return true;
      }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (boardWithValues[0][i] === activePlayer.token &&
          boardWithValues[1][i] === activePlayer.token &&
          boardWithValues[2][i] === activePlayer.token
        ) {   
        return true;
      }
    }
    // Check diagonals
    if (
      (
        boardWithValues[0][0] === activePlayer.token &&
        boardWithValues[1][1] === activePlayer.token &&
        boardWithValues[2][2] === activePlayer.token
      ) || (
        boardWithValues[0][2] === activePlayer.token &&
        boardWithValues[1][1] === activePlayer.token &&
        boardWithValues[2][0] === activePlayer.token
      )
    ) { 
      return true;
    }
  }

  const checkForTie = () => {
    // If any of the cell values are false, a.k.a. null, a.k.a. empty, can't be a tie.
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board.getBoardWithValues()[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  const playRound = function(row, column) {
    // If move wasn't done successfully, return
    if (!board.addMove(row, column, activePlayer.token)) {
      return;
    }

    // Check for winner and tie after each move
    if (checkForWinner()) {
      result = `${getActivePlayer().name} has won the game!`;
      return;
    }
    else if (checkForTie()) {
      result = 'Tie';
      return;
    }
    else {
      changeTurn();
    }    
  }

  return { 
    playRound, 
    getBoard: board.getBoard, 
    getActivePlayer,
    getResult,
    resetGame,
  }
}


function ScreenController() {
  const game = Game();

  let board = null;
  let turn = null;

  const container = document.querySelector('.ui-container');

  const cellClickHandler = function(event) {
    const cell = event.target;
    game.playRound(cell.dataset.row, cell.dataset.col);
    renderBoard();
    if (game.getResult()) {
      handleGameOver();
    }
  }

  const handleGameOver = function() {
    resetEventListeners();
    renderGameOverScreen(game.getResult());
  }

  const resetEventListeners = function() {
    // Remove board cell's event listeners
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.removeEventListener('click', cellClickHandler);
    });
  }

  // For each cell in board, create a btn and append to board
  const renderBoard = function() {
    // Clear the board first, otherwise we'll append 9 new cells everytime
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }

    // Update the turn with active player
    turn.textContent = `${game.getActivePlayer().name}'s turn.`;

    // Update the board with latest cell values
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellBtn = document.createElement('button');
        cellBtn.dataset.row = i;
        cellBtn.dataset.col = j;
        cellBtn.classList.add('cell');
  
        cellBtn.textContent = game.getBoard()[i][j].getValue();
        board.appendChild(cellBtn);
      }
    }

    // Add event listeners to all cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.addEventListener('click', cellClickHandler);
    });
  }

  const renderGameOverScreen = function(result) {
    // Make game screen faded
    const gameScreen = document.querySelector('.ui-container');
    gameScreen.classList.add('faded');

    const gameOverScreen = document.querySelector('.game-over-modal');
    gameOverScreen.classList.remove('hidden');

    // Clear game over screen
    gameOverScreen.textContent = '';

    // Create game over screen content
    const gameOverText = document.createElement('div');
    gameOverText.classList.add('game-over');
    gameOverText.textContent = result;

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.classList.add('play-again-btn');

    // Append game over screen content
    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(playAgainBtn);

    const handlePlayAgain = function() {
      gameOverScreen.classList.add('hidden');
      gameScreen.classList.remove('faded');
  
      // Initialize new game
      game.resetGame()
      renderBoard();
    }

    playAgainBtn.addEventListener('click', handlePlayAgain);  
  }

  const getPlayerNames = function() {
    const player1 = document.querySelector('#player1').value;
    const player2 = document.querySelector('#player2').value;

    players[0].name = player1;
    players[1].name = player2;
  }

  const renderGameScreen = function() {
    container.textContent = '';

    board = document.createElement('div');
    turn = document.createElement('div');

    board.classList.add('gameBoard');
    turn.classList.add('playTurn');

    container.appendChild(board);
    container.appendChild(turn);
  }

  const startGame = function() {
    renderGameScreen();
    renderBoard();
  } 

  // Start button
  const startBtn = document.querySelector('.start-game');
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getPlayerNames();
    startGame();
  });

}

ScreenController();