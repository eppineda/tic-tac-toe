angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', [
'$fancyModal',
'$scope',
'Game',
function($fancyModal, $scope, Game) {
    $scope.player = {}
    $fancyModal.open({ templateUrl: 'modal.html' })

    Game.join($scope.player.name).then(
        function(success) {
            var waiting = success
            // todo: this person is waiting. create a game with that person.
            console.log(waiting)
        },
        function(failure) {
            console.error(failure)

            var waitingList = [] // todo: firebase
            var continueWaiting = function() {
                // todo: ask to continue waiting for another player
                return false
            }
            var playerJoined = function(waitingList) {
                if ([] === waitingList) return false
            }

            while (continueWaiting()) {
                $timeout(function() {
                    if (playerJoined(waitingList)) {
                        Game.create($scope.player.name).then(
                            function(success) {},
                            function(failure) {},
                            function(update) {}
                        )
                    }
                }, 60000)
            } // while
        },
        function(update){
            console.log(update)
        }
    )
/*
    if (opponent.found) this is a firebase object e.g. { location:'us', marker:'O', found:true }
        $fancyModal.close()
*/
}])
