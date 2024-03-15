let currentPlayer = 'black';
let moveCount = 0;

// Oyun alanı matrisi
let boardState = Array.from(Array(8), () => new Array(8).fill(''));

// Fonksiyon: Oyun Alanını Oluştur
function createBoard() {
    const board = document.getElementById('board');
    for (let i = 0; i < 8; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.column = j;
            cell.addEventListener('click', () => handleCellClick(i, j));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

// Fonksiyon: Hamle Yapıldığında Çağrılır
function handleCellClick(row, column) {
    if (isValidMove(row, column)) {
        boardState[row][column] = currentPlayer;
        renderBoard();
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        moveCount++;
        updateStatistics();
    }
}

// Fonksiyon: Geçerli Hamle Kontrolü
function isValidMove(row, column) {
    return boardState[row][column] === '';
}

// Fonksiyon: Oyun Alanını Yenile
function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const column = parseInt(cell.dataset.column);
        cell.classList.remove('black', 'white');
        cell.classList.add(boardState[row][column]);
    });
}

// Fonksiyon: İstatistikleri Güncelle
function updateStatistics() {
    const statisticsElement = document.getElementById('statistics');
    statisticsElement.innerHTML = `
        <p>Oyun İstatistikleri:</p>
        <ul>
            <li>Hamle Sayısı: ${moveCount}</li>
            <li>Kalan Taş Sayısı: ${64 - moveCount}</li>
        </ul>
    `;
}

// Başlangıçta oyun alanını oluştur
createBoard();
