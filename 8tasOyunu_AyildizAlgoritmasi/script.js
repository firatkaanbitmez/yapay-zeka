$(document).ready(function () {
    var board = $('#puzzleBoard');
    var tiles = [];
    var emptyIndex = 8;

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

    // A* Algoritması ile çözme butonuna tıklama olayını ekle
    $('#solveButton').click(function () {
        var solution = solvePuzzle(numbers);
        if (solution) {
            displaySolutionInfo(solution);
        } else {
            alert("Bu bulmaca çözülemez.");
        }
    });

    // Kareye tıklandığında hareketi işle
    function moveTile() {
        var clickedIndex = parseInt($(this).attr('data-index'));
        if (isValidMove(clickedIndex)) {
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

    // A* algoritması ile 8 puzzle problemi çözümü
    function solvePuzzle(puzzle) {
        // Hedef durumu belirle
        var goalState = [1, 2, 3, 4, 5, 6, 7, 8, ''];

        // Başlangıç düğümünü oluştur
        var startNode = {
            state: puzzle,
            parent: null,
            move: null,
            cost: 0,
            heuristic: calculateHeuristic(puzzle)
        };

        // Açık listeyi başlangıç düğümü ile başlat
        var openList = [startNode];
        var closedList = [];

        while (openList.length > 0) {
            // En iyi düğümü seç (en düşük f + h maliyetli)
            var currentNode = openList[0];
            var currentIndex = 0;
            openList.forEach(function (node, index) {
                if (node.cost + node.heuristic < currentNode.cost + currentNode.heuristic) {
                    currentNode = node;
                    currentIndex = index;
                }
            });

            // Çözümü bulduk mu?
            if (currentNode.state.toString() === goalState.toString()) {
                var solution = [];
                var current = currentNode;
                while (current !== null) {
                    solution.unshift(current.move);
                    current = current.parent;
                }
                return solution.slice(1); // Başlangıç düğümünü atla
            }

            // Açık listeden çıkar, kapalı listeye ekle
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            // Hareketler için komşu düğümleri kontrol et
            var neighbors = generateNeighbors(currentNode);
            neighbors.forEach(function (neighbor) {
                if (!containsNode(closedList, neighbor.state)) {
                    var gScore = currentNode.cost + 1; // Maliyet güncelleme
                    var inOpenList = containsNode(openList, neighbor.state);
                    if (!inOpenList || gScore < neighbor.cost) {
                        neighbor.cost = gScore;
                        neighbor.heuristic = calculateHeuristic(neighbor.state);
                        neighbor.parent = currentNode;
                        if (!inOpenList) {
                            openList.push(neighbor);
                        }
                    }
                }
            });
        }

        // Çözüm bulunamadı
        return null;
    }

    // Hurestic fonksiyonunu hesapla (Manhattan mesafesi)
    function calculateHeuristic(state) {
        var heuristic = 0;
        state.forEach(function (value, index) {
            if (value !== '') {
                var goalIndex = value - 1;
                var rowIndex = Math.floor(index / 3);
                var colIndex = index % 3;
                var goalRow = Math.floor(goalIndex / 3);
                var goalCol = goalIndex % 3;
                heuristic += Math.abs(rowIndex - goalRow) + Math.abs(colIndex - goalCol);
            }
        });
        return heuristic;
    }

    // Komşu düğümleri oluştur
    function generateNeighbors(node) {
        var neighbors = [];
        var emptyIndex = node.state.indexOf('');
        var emptyRow = Math.floor(emptyIndex / 3);
        var emptyCol = emptyIndex % 3;

        var moves = [
            { row: -1, col: 0, action: 'Down' },
            { row: 1, col: 0, action: 'Up' },
            { row: 0, col: -1, action: 'Right' },
            { row: 0, col: 1, action: 'Left' }
        ];

        moves.forEach(function (move) {
            var newRow = emptyRow + move.row;
            var newCol = emptyCol + move.col;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                var newState = node.state.slice();
                var newIndex = newRow * 3 + newCol;
                newState[emptyIndex] = newState[newIndex];
                newState[newIndex] = '';
                neighbors.push({
                    state: newState,
                    parent: node,
                    move: move.action,
                    cost: 0,
                    heuristic: 0
                });
            }
        });

        return neighbors;
    }

    // Düğüm listesinde belirli bir durumu içeriyor mu kontrol et
    function containsNode(nodeList, state) {
        return nodeList.some(function (node) {
            return node.state.toString() === state.toString();
        });
    }


    // Çözüm bilgisini ekrana göster
    function displaySolutionInfo(solution) {
        var solutionText = "Çözüm Adımları:<br>";
        for (var i = 0; i < solution.length; i++) {
            solutionText += (i + 1) + ". Adım: " + solution[i] + "<br>";
        }
        $('#solutionInfo').html(solutionText);
    }
});
