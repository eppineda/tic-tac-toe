angular.module('tic-tac-toe.services', [])
.constant('URL', 'https://tictactoe-eppineda.firebaseio.com')
.factory('FirebaseAccess', ['$firebaseObject', function($firebaseObject) {
    var refGames = new Firebase(URL + '/games')
    var refWaiting = new Firebase(URL + '/waiting')
    return {
        games:function() { return refGames},
        waiting:function() { return refWaiting }
    }
}])
