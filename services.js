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
        create:function(X, O) {
            var deferred = $q.defer()
            var games = $firebaseArray(FirebaseAccess.games()) /* todo: possible
                race condition */
            var constants = { 'waiting':'waiting', 'playing':'playing',
                'win':'win', 'draw':'draw' }

            $timeout(function() {
                var game = {
                    status:constants.waiting,
                    players:[
                        { who:X.who, ip:X.ip },
                        { who:O.who, ip:O.ip }
                    ],
                    active:{ who:X.who, grid:-1 } // -1 means turn not taken
                }

                deferred.notify('joining ' + X.who)
                games.$add(game).then(
                    function(success) {
// create game added
                        deferred.resolve(success)
                    },
                    function(failure) { deferred.reject(failure) },
                    function(update) { console.log(update) }
                )
            }, 1500)
            return deferred.promise
        }, // create
        join:function(playerName) {
            var deferred = $q.defer()
            var waiting = $firebaseArray(FirebaseAccess.waiting())

            $timeout(function() {
                deferred.notify('searching for another player')
                if (1 > waiting.length)
                    deferred.reject(waiting.length)
                else {
// another player found
                    var opponent = { who:waiting[0].who, ip:waiting[0].ip }

                    waiting.$remove(0)
                    deferred.resolve(opponent)
                }
            }, 1500)
            return deferred.promise
        }, // join
        wait:function(playerName) {
// wait for another player
            var deferred = $q.defer()

            deferred.solve({ who:'who', ip:'127.0.0.1' })
            // todo: watch waiting in firebase
            return deferred.promise
        },
        playAgain:function() {
// reverse markers -- play the same person
        }
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
