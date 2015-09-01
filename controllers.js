angular.module('tic-tac-toe.controllers', ['firebase', 'vesparny.fancyModal'])
.controller('GameCtrl', ['$fancyModal', function($fancyModal) {
    $fancyModal.open({ templateUrl: 'modal.html' })
/*
    if (opponent.found) this is a firebase object e.g. { location:'us', marker:'O', found:true }
        $fancyModal.close()
*/
}])
