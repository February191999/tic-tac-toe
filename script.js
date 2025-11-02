function Cell() {
    let value = 0; // Value 0 means not occupied yet
    
    const markCell = (player) => {
        value = player; // Sets value to player's mark 
    }

    const getValue = () => value; // Gets the value of the current cell

    return {
        markCell, 
        getValue
    };
}

function Gameboard () {

    const boardSize = 3; 
    const board = [];

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i].push(Cell());
        }
    }; 

    const getBoard = () => board;

    const markSquare = (row, column, player) => {
        const square = board[column][row] // Selects square to occupy
        if (square.getValue() !== 0) return false; //Checks if square is occupied and return false if occupied
        square.markCell(player); // Add player mark if not occupied
        return true;
    };
    
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue())) //Check each row and column to see value
        console.log(boardWithCellValues);
    };

    return { getBoard, markSquare, printBoard};
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "O"
        },
        {
            name: playerTwoName,
            token: "X"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; // Checks to see which player is currently active and switches to the inactive player
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        console.log(
            `${getActivePlayer().name} marked row and column: ${row} and ${column}`
        );
        board.markSquare(row, column, getActivePlayer().token); // mark cell with the selected row and column with the active player's mark

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = ""; // Empties board

        const board = game.getBoard(); // Gets the newest version of the board and player turn from game controller
        const activePlayer = game.getActivePlayer(); 

        playerTurnDiv.textContent = `${activePlayer.name}'s turn` // Displays current player's turn

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = cell.getValue() === 0 ? "" : cell.getValue(); // Make cell show up as blank cells if they are empty
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        if (selectedColumn === undefined || selectedRow === undefined) return;

        game.playRound(parseInt(selectedColumn), parseInt(selectedRow));
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();