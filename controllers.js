angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', [
'$fancyModal',
'$firebaseObject',
'$scope',
'Game',
function($fancyModal, $firebaseObject, $scope, Game) {
    $scope.player = { name:'player' }
    $fancyModal.open({ templateUrl: 'modal.html' })

    Game.join($scope.player.name).then(
        function(success) {
            var opponent = success
            var you = { who:$scope.player.name,
                ip:'127.0.0.1' /* todo: get the ip address */}

            Game.create(opponent, you).then(
                function(success) {
                    var game = $firebaseObject(success)// newly-created in firebase

                    console.log(game)
                },
                function(failure) { console.error(failure) },
                function(update) { console.log(update) }
            )
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
