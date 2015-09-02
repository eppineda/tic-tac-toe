angular.module('tic-tac-toe.services', [])
.constant('FIREBASE_URL', 'https://tictactoe-eppineda.firebaseio.com')
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
            var deferred = $q.defer()
            var waiting = $firebaseArray(FirebaseAccess.waiting())

            $timeout(function() {
                deferred.notify('retrieving names of players already waiting')
                if (1 > waiting.length)
                    deferred.reject(waiting.length)
                else {
                    deferred.resolve(waiting)
                }
            }, 1500)
            return deferred.promise
        },
        create:function(playerName) {
            // assigned 'X' -- first player
        },
        playAgain:function() {}
    }
}])
.factory('FirebaseAccess', [
'FIREBASE_URL',
function(FIREBASE_URL) {
    var refGames = new Firebase(FIREBASE_URL + '/games')
    var refWaiting = new Firebase(FIREBASE_URL + '/waiting')
    return {
        games:function() { return refGames},
        waiting:function() { return refWaiting }
    }
}])
