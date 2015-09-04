angular.module('tic-tac-toe.providers', [])
.directive('ticTacToe', [function() {
    var constants = { "waiting":"waiting", "ready":"ready", "playing":"playing",
        "winner":"winner", "draw":"draw" }
    return {
        restrict:'E',
        templateUrl:'board.html',
        replace:true,
        scope:{},
        controller:function($scope) {
            $scope.status = ''
            $scope.next = 'X'
            $scope.turns = 0
            $scope.coords = [
                ' ', ' ', ' ',
                ' ', ' ', ' ',
                ' ', ' ', ' '
            ]
            $scope.coordsWinning = []
            $scope.isDisabled = true
            $scope.move = function(cell) {
                if ($scope.isDisabled)
                    return // not allowed to take a turn
                if (' ' !== $scope.coords[cell])
                    return // invalid move
                if (constants.winner == $scope.status || constants.draw == $scope.status)
                    return // game over

// still playing

                $scope.status = constants.playing
                $scope.coords[cell] = $scope.next
                if ('X' === $scope.next)
                    $scope.next = 'O'
                else
                    $scope.next = 'X'

// record-keeping

                ++$scope.turns
                if ($scope.isItAWin($scope.coords)) {
                    $scope.status = constants.winner
                    return
                }
                if ($scope.turns > 8) {
                    $scope.status = constants.draw
                    return
                }
            } // move
            $scope.isItAWin = function(coords) {
                if (constants.ready === $scope.status || constants.draw === $scope.status)
                    return false
                if (constants.winner === $scope.status)
                    return true

// game in progress

                var tests = []
                var row1win = [ 0, 1, 2 ]; tests.push(row1win)
                var row2win = [ 3, 4, 5 ]; tests.push(row2win)
                var row3win = [ 6, 7, 8 ]; tests.push(row3win)
                var col1win = [ 0, 3, 6 ]; tests.push(col1win)
                var col2win = [ 1, 4, 7 ]; tests.push(col2win)
                var col3win = [ 2, 5, 8 ]; tests.push(col3win)
                var dia1win = [ 0, 4, 8 ]; tests.push(dia1win)
                var dia2win = [ 2, 4, 6 ]; tests.push(dia2win)
                var win = function(cells, coords) {
                    if (3 !== cells.length)
                        throw { name:'GameException', msg:'not evaluating 3 cells in a row' }
                    if (' ' == coords[cells[0]] || ' ' == coords[cells[1]] || ' ' == coords[cells[2]])
                        return false
                    if (coords[cells[0]] === coords[cells[1]] && coords[cells[0]] === coords[cells[2]])
                        return true
                    return false
                }

                for (var t in tests) {
                    if (win(tests[t], coords)) {
                        $scope.coordsWinning = tests[t]
                        return true
                    }
                }
                return false
            } // isItAWin
            $scope.statusColor = function(cell) {
                if (constants.winner === $scope.status) {
                    if (!$scope.coordsWinning.toString().match(cell))
                        return constants.ready
                }
                return $scope.status
            }
        } // controller
    } // return
}])
