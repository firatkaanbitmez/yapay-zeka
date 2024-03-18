$(document).ready(function () {
    var board = $('#eightstoneBoard');
    var tiles = [];
    var emptyIndex = 8;
    var openList = []; // openList değişkenini global olarak tanımla
    var closedList = []; // closedList değişkenini global olarak tanımla

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
        var solution = solveeightstone(numbers);
        if (solution) {
            displaySolutionInfo(solution.solution, solution.realCost, solution.heuristicCost, solution.realCost + solution.heuristicCost, openList.concat(closedList));
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
    function calculateHeuristic(state) {
        var misplaced = 0;
        for (var i = 0; i < state.length; i++) {
            if (state[i] !== '' && state[i] !== i + 1) {
                misplaced++;
            }
        }
        return misplaced;
    }
    // A* algoritması ile 8 eightstone problemi çözümü

    function solveeightstone(eightstone) {
        // Hedef durumu belirle
        var goalState = [1, 2, 3, 4, 5, 6, 7, 8, ''];

        // Başlangıç düğümünü oluştur
        var startNode = {
            state: eightstone,
            parent: null,
            move: null,
            cost: 0,
            heuristic: calculateHeuristic(eightstone)
        };

        // Açık listeyi başlangıç düğümü ile başlat
        openList = [startNode]; // global openList değişkenini güncelle
        closedList = []; // global closedList değişkenini güncelle

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
                var realCost = 0;
                while (current !== null) {
                    if (current.move) {
                        solution.unshift(current.move);
                        realCost++;
                    }
                    current = current.parent;
                }
                var heuristicCost = currentNode.heuristic;
                return { solution: solution, realCost: realCost, heuristicCost: heuristicCost };
            }

            // Açık listeden çıkar, kapalı listeye ekle
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            // Hareketler için komşu düğümleri kontrol et
            var neighbors = generateNeighbors(currentNode);
            neighbors.forEach(function (neighbor) {
                if (!containsNode(closedList, neighbor.state)) {
                    var gScore = currentNode.cost + 1; // Gerçek maliyet güncelleme
                    var inOpenList = containsNode(openList, neighbor.state);
                    if (!inOpenList || gScore < neighbor.cost) {
                        neighbor.cost = gScore;
                        neighbor.heuristic = calculateHeuristic(neighbor.state); // Sezgisel maliyet
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





    // Komşu düğümleri oluştur
    function generateNeighbors(node) {
        var neighbors = [];
        var emptyIndex = node.state.indexOf('');
        var emptyRow = Math.floor(emptyIndex / 3);
        var emptyCol = emptyIndex % 3;

        var moves = [
            { row: -1, col: 0, action: 'Boş Kutucuk Yukarı' },
            { row: 1, col: 0, action: 'Boş Kutucuk Aşağı' },
            { row: 0, col: -1, action: 'Boş Kutucuk Sola' },
            { row: 0, col: 1, action: 'Boş Kutucuk Sağa' }
        ];

        moves.forEach(function (move) {
            var newRow = emptyRow + move.row;
            var newCol = emptyCol + move.col;
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                var newState = node.state.slice();
                var newIndex = newRow * 3 + newCol;
                newState[emptyIndex] = newState[newIndex];
                newState[newIndex] = '';
                // Hesaplanan heuristic değerini ayarla
                var newHeuristic = calculateHeuristic(newState);
                neighbors.push({
                    state: newState,
                    parent: node,
                    move: move.action,
                    cost: 0,
                    heuristic: newHeuristic // Doğru hesaplanan heuristic değeri
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

    function displaySolutionInfo(solution, realCost, heuristicCost, totalCost, solutionTree) {
        var solutionText = "Çözüm Adımları:<br>";
        for (var i = 0; i < solution.length; i++) {
            solutionText += solution[i] + "<br>";
        }

        if (solutionTree) {
            solutionText += "<br>Çözüm Ağacı:<br>";
            solutionTree.forEach(function (node, index) {
                solutionText += "Adım " + index + ": Durum: " + node.state + ", Gerçek Maliyet: " + node.cost + ", Sezgisel Maliyet: " + node.heuristic + ", Toplam Maliyet: " + (node.cost + node.heuristic) + "<br>";
            });
        }

        $('#solutionInfo').html(solutionText);
    }
});

