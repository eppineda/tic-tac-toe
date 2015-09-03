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
    var newGame = function(X, O) {
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
            games.$add(game).then(
                function(success) {
// new game added
                    deferred.resolve(success)
                },
                function(failure) { deferred.reject(failure) },
                function(update) { console.log(update) }
            )
        }, 1500)
        return deferred.promise
    } // newGame

    return {
        join:function(playerName) {
            var deferred = $q.defer()
            var waiting = $firebaseArray(FirebaseAccess.waiting())
            var promises = []

            $timeout(function() {
                deferred.notify('retrieving names of players already waiting')
                if (1 > waiting.length)
                    deferred.reject(waiting.length)
                else {
// assigned 'O' -- another player already waiting
                    deferred.resolve(waiting[0])

                    var you = { who:playerName, ip:'127.0.0.1' }
                    var opponent = {}

                    opponent.ip = waiting[0]
                    opponent.who = waiting[0].who
                    waiting.$remove(0)
                    promises.push(newGame(opponent, you))
                }
                promises.push(deferred.promise)
            }, 1500)
            return deferred.promise
        },
        create:function(playerName) {
// assigned 'X' -- another player has arrived
            var deferred = $q.defer()

            deferred.solve({ who:'who', ip:'127.0.0.1' })
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
