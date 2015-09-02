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
