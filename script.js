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

function Gameboard() {

    const boardSize = 3; 
    const board = [];

    for (let i = 0; i < boardSize; i++) { // Create 3x3 board
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i].push(Cell());
        }
    }; 

    const getBoard = () => board; // Return board array so other modules can read

    const markSquare = (row, column, player) => {
        const square = board[column][row] // Selects square to occupy
        if (square.getValue() !== 0) return false; //Checks if square is occupied and return false if occupied
        square.markCell(player); // Add player mark if not occupied
        return true;
    };
    
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue())) //Check each row and column to see value
        console.log(boardWithCellValues); // Prints in console
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

    let gameOver = false;

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]; // Checks to see which player is currently active and switches to the inactive player
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const checkWinner = () => { // Checks game for winner

        const boardValues = board.getBoard().map(row => row.map(cell => cell.getValue())); 

        const winPatterns = [ // Winning patterns

            // Rows
            [[0,0], [0,1], [0,2]],
            [[1,0], [1,1], [1,2]],
            [[2,0], [2,1], [2,2]],

            // Columns
            [[0,0], [1,0], [2,0]],
            [[0,1], [1,1], [2,1]],
            [[0,2], [1,2], [2,2]],

            // Diagonals
            [[0,0], [1,1], [2,2]],
            [[0,2], [1,1], [2,0]]
        ];

        for (const pattern of winPatterns) { // Loops over each winning pattern 
            const [a, b, c] = pattern; // Assign winning patterns to variables and access player values on the board
            const firstValue = boardValues[a[0]][a[1]];
            const secondValue = boardValues[b[0]][b[1]];
            const thirdValue = boardValues[c[0]][c[1]];

            if (firstValue !== 0 && firstValue === secondValue && firstValue === thirdValue) { // Checks to see if all values in the given pattern are the same
                return firstValue; // Returns the winning player token if the 3 values are the same
            }
        }

        const isDraw = boardValues.flat().every(cell => cell !== 0); // Checks if every cell is occupied
        if (isDraw) return "draw"; // Returns draw if every cell is filled and no winning pattern matched

        return null;
    }
    
    const isGameOver = () => gameOver;

    const playRound = (row, column) => {
        console.log(
            `${getActivePlayer().name} marked row and column: ${row} and ${column}`
        );
        const marked = board.markSquare(row, column, getActivePlayer().token); // mark cell with the selected row and column with the active player's mark
        if (!marked) {
            console.log("Square already marked");
            return;
        }

        const result = checkWinner();

        if (result === "X" || result ==="O") { // If result is X or O, declare the winning player accordingly
            console.log(`${getActivePlayer().name} wins!`);
            board.printBoard();
            gameOver = true; // End game if winning player is found
            return;
        } else if (result === "draw") {
            console.log("Tie!");
            gameOver = true; // End game if both players draw
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver
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

        board.forEach((row, rowIndex) => { // Creates each clickable cell button
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

        if (game.isGameOver && game.isGameOver()) {
            playerTurnDiv.textContent = "Game Over!";
        };

        game.playRound(parseInt(selectedColumn), parseInt(selectedRow));
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();