angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.constant('TIMER_WAIT', 10000)
.controller('GameCtrl', [
'$fancyModal',
'$firebaseArray',
'$firebaseObject',
'$q',
'$rootScope',
'$scope',
'$timeout',
'FirebaseAccess',
'Game',
'TIMER_WAIT',
function($fancyModal, $firebaseArray, $firebaseObject, $q, $rootScope, $scope,
    $timeout, FirebaseAccess, Game, TIMER_WAIT) {
    var whoseTurn = function(game) {
        console.log('whoseTurn', game)
        return game['active'].who
    }

    $scope.player = { name:'player' }
    $scope.yourTurn = false
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
                            game.$watch(function(event) {
                                console.log(event)
                                $scope.yourTurn = $scope.player.name === whoseTurn(game)
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

            var continueWaiting = function() {
                var keepWaiting = false
                $timeout(function() {
                    // todo: ask to continue waiting for another player
                    keepWaiting = false
                }, TIMER_WAIT)
                return keepWaiting
            }
            var playerArrival = function(gameid) {
                var deferred = $q.defer()
                var games = $firebaseArray(FirebaseAccess.games().
                    orderByChild('id').equalTo(gameid))

                $timeout(function() {
                    deferred.notify('monitoring list of games')
                    games.$loaded(function(success) {
                        games.$watch(
                            function(eventObj) {
                                if ('child_added' === eventObj.event)
                                    deferred.resolve(games.$getRecord(eventObj.key))
                            },
                            function(failure) { deferred.reject(failure) }
                        )
                    })
                }, 1500)
                return deferred.promise
            } // playerArrival
            var you = { who:$scope.player.name,
                ip:'127.0.0.1' /* todo: get the ip address */ }

            Game.wait(you).then(
                function(success) {
// waiting for another player
                    var waiting = $firebaseObject(success)

                    waiting.$loaded(function() {
                        do {
                            playerArrival(waiting.game).then(
                                function(game) {
// another player arrived and created a game
                                    console.log('another player has joined', game)
                                },
                                function(failure) { console.error(failure) },
                                function(update) { console.log(update) }
                            )
                        } while (continueWaiting())
                    })
                },
                function(failure) { console.error(failure) },
                function(update) { console.log(update) }
            )
        },
        function(update) { console.log(update) }
    )
}])
