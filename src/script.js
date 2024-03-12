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

  return { getBoard, addMove, getBoardWithValues }
}


function Game() {
  const board = Gameboard()
  let result = null;

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
  }
}


function ScreenController() {
  const game = Game();

  // Get turn and board from DOM
  const board = document.querySelector('.board');
  const turn = document.querySelector('.turn');

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
    const gameScreen = document.querySelector('.container');
    const gameOverScreen = document.querySelector('.game-over-modal');
    gameScreen.classList.add('translucent');
    gameOverScreen.classList.remove('hidden');

    const gameOverText = document.querySelector('.game-over');
    gameOverText.textContent = result;

    const playAgainBtn = document.querySelector('.play-again-btn');

    playAgainBtn.addEventListener('click', () => {
      gameOverScreen.classList.add('hidden');
      gameScreen.classList.remove('translucent');

      // Initialize new game
      ScreenController();
    });
    
  }
  
  // Initial render
  renderBoard();
}

ScreenController();