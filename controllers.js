angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', [
'$fancyModal',
'$firebaseObject',
'$scope',
'Game',
function($fancyModal, $firebaseObject, $scope, Game) {
    $scope.player = { name:'player' }
    $fancyModal.open({ templateUrl: 'modal.html', scope:$scope })

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
            Game.create(opponent, you).then(
                function(success) {
// game created
                    var game = $firebaseObject(success)// newly-created in firebase

                    $fancyModal.close()
                    game.$loaded().then(
                        function(success) {
                            game.status = Game.constants.playing
                            game.$save()
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

                    console.log('now in wait queue', you)
                    while (continueWaiting()) {
                    } // while
                },
                function(failure) { console.error(failure) },
                function(update) { console.log(update) }
            )
        },
        function(update) { console.log(update) }
    )
}])
