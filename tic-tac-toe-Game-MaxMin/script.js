// Tic Tac Toe Game Logic

// Game constants
const X = 'X';
const O = 'O';
const EMPTY = '';
const HUMAN = X;
const COMPUTER = O;

// Initial state of the board
let board = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to check if a player has won
function checkWin(player) {
    return winningCombos.some(combo => combo.every(index => board[index] === player));
}

// Function to check if the board is full
function checkDraw() {
    return !board.includes(EMPTY);
}

// Function to make a move
function makeMove(player, index) {
    if (board[index] === EMPTY) {
        board[index] = player;
        return true;
    }
    return false;
}

// Function to reset the game
function resetGame() {
    board = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
    render();
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    if (checkWin(COMPUTER)) {
        return 10 - depth;
    } else if (checkWin(HUMAN)) {
        return depth - 10;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === EMPTY) {
                board[i] = COMPUTER;
                let score = minimax(board, depth + 1, false);
                board[i] = EMPTY;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === EMPTY) {
                board[i] = HUMAN;
                let score = minimax(board, depth + 1, true);
                board[i] = EMPTY;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Function to get the best move for the computer
function getBestMove() {
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) {
            board[i] = COMPUTER;
            let score = minimax(board, 0, false);
            board[i] = EMPTY;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

// Function to handle cell click
function cellClicked(index) {
    if (!checkWin(HUMAN) && !checkWin(COMPUTER) && !checkDraw()) {
        if (makeMove(HUMAN, index)) {
            render();
            if (!checkWin(HUMAN) && !checkDraw()) {
                setTimeout(() => {
                    let bestMove = getBestMove();
                    makeMove(COMPUTER, bestMove);
                    render();
                }, 500); // Delay for computer move visualization
            }
        }
    }
}

// Function to render the board
function render() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });

    const status = document.getElementById('status');
    if (checkWin(HUMAN)) {
        status.textContent = 'You win!';
    } else if (checkWin(COMPUTER)) {
        status.textContent = 'Computer wins!';
    } else if (checkDraw()) {
        status.textContent = 'Draw!';
    } else {
        status.textContent = '';
    }

    renderTree();
}

// Function to render the game tree
function renderTree() {
    const tree = document.getElementById('tree');
    tree.innerHTML = ''; // Clear the previous tree

    const rootNode = document.createElement('ul');
    const rootNodeItem = document.createElement('li');
    rootNodeItem.textContent = 'Root';
    rootNode.appendChild(rootNodeItem);
    tree.appendChild(rootNode);

    // Render the tree recursively
    renderTreeNode(rootNodeItem, board, 0, true);
}

// Function to render a tree node recursively
function renderTreeNode(parentNode, board, depth, isMaximizing) {
    if (checkWin(COMPUTER) || checkWin(HUMAN) || checkDraw() || depth === 9) {
        return;
    }

    const childNode = document.createElement('ul');
    const player = isMaximizing ? COMPUTER : HUMAN;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) {
            board[i] = player;
            const childNodeItem = document.createElement('li');
            childNodeItem.textContent = `Depth: ${depth}, Index: ${i}, Score: ${minimax(board, depth + 1, !isMaximizing)}`;
            childNode.appendChild(childNodeItem);
            parentNode.appendChild(childNode);
            board[i] = EMPTY;
        }
    }
}

// Initial render
render();
