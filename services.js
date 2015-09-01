angular.module('tic-tac-toe.services', [])
.constant('URL', 'https://tictactoe-eppineda.firebaseio.com')
.constant('X', 'X')
.constant('O', 'O')
.factory('Game', [function() {
    return {
        join:function(playerName) {
            // assigned 'O' -- second player
        },
        create:function(playerName) {
            // assigned 'X' -- first player
        }
    }
}])
.factory('FirebaseAccess', ['$firebaseObject', function($firebaseObject) {
    var refGames = new Firebase(URL + '/games')
    var refWaiting = new Firebase(URL + '/waiting')
    return {
        games:function() { return refGames},
        waiting:function() { return refWaiting }
    }
}])
