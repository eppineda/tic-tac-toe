angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', ['$fancyModal', '$scope', function($fancyModal, $scope) {
    $scope.player = {}
    $fancyModal.open({ templateUrl: 'modal.html' })
/*
    if (opponent.found) this is a firebase object e.g. { location:'us', marker:'O', found:true }
        $fancyModal.close()
*/
}])
