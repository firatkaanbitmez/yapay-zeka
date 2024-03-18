$(document).ready(function () {
    var board = $('#puzzleBoard');
    var tiles = [];
    var emptyIndex = 8; // Başlangıçta boş olan karenin dizinini tutar

    // Oyun tahtasını oluştur
    for (var i = 0; i < 9; i++) {
        var tile = $('<div class="tile"></div>').attr('data-index', i);
        tile.click(moveTile);
        tiles.push(tile);
        board.append(tile);
    }

    // Başlangıç durumunu belirle
    var numbers = Array.from({ length: 9 }, (_, i) => i === 8 ? '' : (i + 1));
    renderBoard();

    // Karıştırma butonuna tıklama olayını ekle
    $('#shuffleButton').click(function () {
        shuffle(numbers);
        renderBoard();
    });

    // Kareye tıklandığında hareketi işle
    function moveTile() {
        var clickedIndex = parseInt($(this).attr('data-index'));
        if (isValidMove(clickedIndex)) {
            // Boş kare ile tıklanan kareyi değiştir
            var temp = numbers[emptyIndex];
            numbers[emptyIndex] = numbers[clickedIndex];
            numbers[clickedIndex] = temp;
            emptyIndex = clickedIndex;
            renderBoard();
            if (isGameWon()) {
                alert("Tebrikler, oyunu kazandınız!");
            }
        }
    }

    // Geçerli bir hareket mi kontrol et
    function isValidMove(clickedIndex) {
        var emptyRow = Math.floor(emptyIndex / 3);
        var emptyCol = emptyIndex % 3;
        var clickedRow = Math.floor(clickedIndex / 3);
        var clickedCol = clickedIndex % 3;
        return (Math.abs(emptyRow - clickedRow) + Math.abs(emptyCol - clickedCol) === 1);
    }

    // Oyunun kazanılıp kazanılmadığını kontrol et
    function isGameWon() {
        for (var i = 0; i < numbers.length - 1; i++) {
            if (numbers[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    // Tahtayı yeniden oluştur
    function renderBoard() {
        tiles.forEach(function (tile, index) {
            tile.text(numbers[index]);
        });
    }

    // Sayıları karıştır
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        emptyIndex = array.indexOf('');
    }
});
