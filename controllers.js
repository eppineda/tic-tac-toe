angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', [
'$fancyModal',
'$firebaseArray',
'$firebaseObject',
'$rootScope',
'$scope',
'FirebaseAccess',
'Game',
function($fancyModal, $firebaseArray, $firebaseObject, $rootScope, $scope,
    FirebaseAccess, Game) {
    var whoseTurn = function(game) {
        return game['active'].who
    }

    $scope.player = { name:'player' }
    $scope.yourTurn = false
    $scope.games = []
    $fancyModal.open({ templateUrl: 'modal.html' })
    $rootScope.$on('$fancyModal.closed', function (e, id) {
        console.log('$fancyModal closed: ' + id);
    })
    Game.join($scope.player.name).then(
        function(success) {
// joining another player, who was already waiting
            var opponent = success
            var you = { who:$scope.player.name,
                ip:'127.0.0.1' /* todo: get the ip address */}

            if (opponent.who.toLowerCase() === you.who.toLowerCase()) {
                // unique names needed for tracking turns
                you.who = you.who + '2'
                $scope.player.name = you.who
            }
            Game.create(opponent, you, opponent.game).then(
                function(success) {
// game created
                    var game = $firebaseObject(success)// newly-created in firebase

                    $fancyModal.close()
                    game.$loaded().then(
                        function(success) {
                            game.status = Game.constants.playing
                            game.$save()
                            $scope.yourTurn = $scope.player.name === whoseTurn(game)
                            $scope.$watch('yourTurn', function(newVal, oldVal) {
                                console.log('yourTurn', newVal)
                            })
                        }
                    )
                },
                function(failure) { console.error(failure) },
                function(update) { console.log(update) }
            )
        }, // join successful
        function(failure) {
// no one to play with
            console.error(failure)

            var you = { who:$scope.player.name,
                ip:'127.0.0.1' /* todo: get the ip address */}
            var continueWaiting = function() {
                // todo: ask to continue waiting for another player
                return false
            }

            Game.wait(you).then(
                function(success) {
// waiting for another player to join
                    var you = $firebaseObject(success)
                    var games = $firebaseArray(FirebaseAccess.games())
                    var game = Game.get(you.game)

                    console.log('now in wait queue', you)
                    $scope.$watch('games', function(newVal, oldVal) {
                        console.log(games.length, 'games')
                    })
/*
                    game.then(
                        function(found) {
                            $scope.yourTurn = $scope.player.name === whoseTurn(game)
                            $scope.$watch('yourTurn', function(newVal, oldVal) {
                                console.log('yourTurn', newVal)
                            })
                            while (continueWaiting()) {
                            } // while
                        },
                        function(notfound) { console.error(notfound) },
                        function(progress) { console.log(progress) }
                    )
*/
                },
                function(failure) { console.error(failure) },
                function(update) { console.log(update) }
            )
        },
        function(update) { console.log(update) }
    )
}])
