$(document).ready(function () {
    var board = $('#eightstoneBoard'); // Oyun tahtasını seç
    var tiles = []; // Oyun tahtasındaki kutucukları temsil eden dizi
    var emptyIndex = 8; // Boş kutucuğun başlangıç indeksi
    var openList = []; // A* algoritması için açık liste
    var closedList = []; // A* algoritması için kapalı liste

    // Oyun tahtasını oluştur
    for (var i = 0; i < 9; i++) {
        var tile = $('<div class="tile"></div>').attr('data-index', i); // Her bir kutucuk için div oluştur
        tile.click(moveTile); // Kutucuğa tıklanınca hareket fonksiyonunu çağır
        tiles.push(tile); // Kutucukları diziye ekle
        board.append(tile); // Kutucukları tahtaya ekle
    }

    // Başlangıç durumunu belirle
    var numbers = Array.from({ length: 9 }, (_, i) => i === 8 ? '' : (i + 1)); // 1'den 9'a kadar sayıları oluştur, sonuncuyu boş bırak
    renderBoard(); // Tahtayı ilk kez çiz

    // Karıştırma butonuna tıklama olayını ekle
    $('#shuffleButton').click(function () {
        shuffle(numbers); // Sayıları karıştır
        renderBoard(); // Tahtayı yeniden çiz
        $('#solutionInfo').html(''); // Çözüm bilgisini temizle
    });

    // A* Algoritması ile çözme butonuna tıklama olayını ekle
    $('#solveButton').click(function () {
        var solution = solveeightstone(numbers); // Oyunu çöz
        if (solution) {
            // Çözüm varsa bilgileri göster
            displaySolutionInfo(solution.solution, solution.realCost, solution.heuristicCost, solution.realCost + solution.heuristicCost, openList.concat(closedList));
        } else {
            alert("Bu bulmaca çözülemez."); // Çözüm yoksa uyarı ver
        }
    });

    // Kareye tıklandığında hareketi işle
    function moveTile() {
        var clickedIndex = parseInt($(this).attr('data-index')); // Tıklanan kutucuğun indeksini al
        if (isValidMove(clickedIndex)) { // Geçerli bir hareket mi kontrol et
            var temp = numbers[emptyIndex]; // Geçici değişken kullanarak sayıları yer değiştir
            numbers[emptyIndex] = numbers[clickedIndex];
            numbers[clickedIndex] = temp;
            emptyIndex = clickedIndex; // Boş kutucuğun indeksini güncelle
            renderBoard(); // Tahtayı yeniden çiz
            if (isGameWon()) {
                alert("Tebrikler, oyunu kazandınız!"); // Oyun kazanıldıysa tebrik et
            }
        }
    }

    // Geçerli bir hareket mi kontrol et
    function isValidMove(clickedIndex) {
        var emptyRow = Math.floor(emptyIndex / 3); // Boş kutucuğun satırını bul
        var emptyCol = emptyIndex % 3; // Boş kutucuğun sütununu bul
        var clickedRow = Math.floor(clickedIndex / 3); // Tıklanan kutucuğun satırını bul
        var clickedCol = clickedIndex % 3; // Tıklanan kutucuğun sütununu bul
        return (Math.abs(emptyRow - clickedRow) + Math.abs(emptyCol - clickedCol) === 1); // Boş kutucukla tıklanan kutucuğun arasındaki mesafe 1 mi?
    }

    // Oyunun kazanılıp kazanılmadığını kontrol et
    function isGameWon() {
        for (var i = 0; i < numbers.length - 1; i++) {
            if (numbers[i] !== i + 1) {
                return false; // Sayılar sıralı değilse oyun henüz kazanılmamıştır
            }
        }
        return true; // Sayılar sıralıysa oyun kazanılmıştır
    }

    // Tahtayı yeniden oluştur
    function renderBoard() {
        tiles.forEach(function (tile, index) {
            tile.text(numbers[index]); // Her kutucuğun metnini sayı ile güncelle
        });
    }

    // Sayıları karıştır
    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)); // Rastgele bir indeks seç
            [array[i], array[j]] = [array[j], array[i]]; // Sayıları yer değiştir
        }
        emptyIndex = array.indexOf(''); // Boş kutucuğun yeni indeksini bul
    }

    // Hedef duruma ulaşmak için gereken sezgisel maliyeti hesapla
    function calculateHeuristic(state) {
        var misplaced = 0;
        for (var i = 0; i < state.length; i++) {
            if (state[i] !== '' && state[i] !== i + 1) {
                misplaced++;
            }
        }
        return misplaced; // Yanlış yerde olan kutucuk sayısını döndür
    }

    // A* algoritması ile 8 taş problemi çözümü
    function solveeightstone(eightstone) {
        var goalState = [1, 2, 3, 4, 5, 6, 7, 8, '']; // Hedef durumu belirle

        var startNode = { // Başlangıç düğümünü oluştur
            state: eightstone,
            parent: null,
            move: null,
            cost: 0,
            heuristic: calculateHeuristic(eightstone)
        };

        openList = [startNode]; // Açık liste ile başla
        closedList = []; // Kapalı listeyi sıfırla

        while (openList.length > 0) { // Açık liste boş olana kadar devam et
            var currentNode = openList[0]; // En iyi düğümü seç (en düşük f + h maliyetli)
            var currentIndex = 0;
            openList.forEach(function (node, index) {
                if (node.cost + node.heuristic < currentNode.cost + currentNode.heuristic) {
                    currentNode = node;
                    currentIndex = index;
                }
            });

            if (currentNode.state.toString() === goalState.toString()) { // Çözümü bulduk mu?
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
                return { solution: solution, realCost: realCost, heuristicCost: heuristicCost }; // Çözümü döndür
            }

            openList.splice(currentIndex, 1); // Açık listeden çıkar
            closedList.push(currentNode); // Kapalı listeye ekle

            var neighbors = generateNeighbors(currentNode); // Komşu düğümleri oluştur
            neighbors.forEach(function (neighbor) {
                if (!containsNode(closedList, neighbor.state)) {
                    var gScore = currentNode.cost + 1;
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

        return null; // Çözüm bulunamadı
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
                var newHeuristic = calculateHeuristic(newState);
                neighbors.push({
                    state: newState,
                    parent: node,
                    move: move.action,
                    cost: 0,
                    heuristic: newHeuristic
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

    // Çözüm bilgilerini göster
    function displaySolutionInfo(solution, realCost, heuristicCost, totalCost, solutionTree) {
        var solutionText = "Çözüm Adımları:<br>";
        for (var i = 0; i < solution.length; i++) {
            solutionText += solution[i] + "<br>"; // Çözüm adımlarını metin olarak oluştur
        }

        if (solutionTree) {
            solutionText += "<div class='solution-tree'><h2>Çözüm Ağacı:</h2><div class='node-details'><table><tr><th>Adım</th><th>Durum</th><th>Gerçek Maliyet</th><th>Sezgisel Maliyet</th><th>Toplam Maliyet</th></tr>";
            solutionTree.forEach(function (node, index) {
                solutionText += "<tr><td>" + index + "</td><td>" + renderBoardState(node.state) + "</td><td>" + node.cost + "</td><td>" + node.heuristic + "</td><td>" + (node.cost + node.heuristic) + "</td></tr>"; // Çözüm ağacını metin olarak oluştur
            });
            solutionText += "</table></div></div>";
        }

        $('#solutionInfo').html(solutionText); // Çözüm bilgilerini ekrana yazdır
    }

    // Tahtanın durumunu HTML olarak oluştur
    function renderBoardState(state) {
        var boardHTML = '<table>';
        for (var i = 0; i < 3; i++) {
            boardHTML += '<tr>';
            for (var j = 0; j < 3; j++) {
                var index = i * 3 + j;
                boardHTML += '<td>' + (state[index] !== '' ? state[index] : ' ') + '</td>'; // Her kutucuğun durumunu HTML olarak oluştur
            }
            boardHTML += '</tr>';
        }
        boardHTML += '</table>';
        return boardHTML; // Tahtanın HTML kodunu döndür
    }
});
