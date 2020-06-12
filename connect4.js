/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 let noClick = false;
const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

const makeBoard = () => {
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }));
	}
};

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
	const board = document.querySelector('#board');

	// Creates the top row that is used to listen for a click and place pieces according to that click
	createTopRow(board);

	// Loops over the entire board and appends cells
	createMainBoardCells(board);
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */
const placeInTable = (y, x) => {
	const piece = document.createElement('div');
	piece.classList.add('piece');
	piece.classList.add(`p${currPlayer}`);

	// Animations according to the clicked row
	piece.classList.add(`fall${6 - y}`);
	
	// Add the piece to the table
	const space = document.getElementById(`${y}-${x}`);
	space.append(piece);
};

/** EndGame: announce game end */
const endGame = (msg) => {
	alert(msg);
	location.reload();
};

/** HandleClick: handle click of column top to play piece */
const handleClick = (evt) => {
	if(noClick) return;
	// Get x from ID of clicked cell
	let x = +evt.target.id;

	// Get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// Place piece in board and add to HTML table
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// Check for win
	if (checkForWin()) {
		noClick = true;
		setTimeout(() => {
			currPlayer = currPlayer === 1 ? 2 : 1;
			endGame(`Player ${currPlayer} won!`);
		}, 1000)
	}

	// Check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		setTimeout(() => {
			currPlayer = currPlayer === 1 ? 2 : 1;
			endGame('Tie!');;
		}, 1000)
	}

	// Switches currPlayer
	currPlayer = currPlayer === 1 ? 2 : 1;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {
	const _win = (cells) => {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	};

	// Variables are declared that contain win conditons for horizontal, vertical and diagonal wins. The for loops go through the board and check for each of these win conditons, and return true if just one them are true.
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
};

const createTopRow = (board) => {
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	board.append(top);
}

const createMainBoardCells = (board) => {
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (var x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}

		board.append(row);
	}
}
makeBoard();
makeHtmlBoard();
