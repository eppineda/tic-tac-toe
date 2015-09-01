angular.module('tic-tac-toe.services', [])
.constant('URL', 'https://tictactoe-eppineda.firebaseio.com')
.constant('X', 'X')
.constant('O', 'O')
.constant('TIMEOUT', 60)
.factory('Game', [
'$firebaseArray',
'$firebaseObject',
'$q',
'$timeout',
'FirebaseAccess',
function(
    $firebaseArray,
    $firebaseObject,
    $q,
    $timeout,
    FirebaseAccess) {
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
