angular.module('tic-tac-toe.services', [])
.constant('FIREBASE_URL', 'https://tictactoe-eppineda.firebaseio.com')
.constant('TIMEOUT', 60)
.constant('WAITING', 'waiting')
.factory('Game', [
'$firebaseArray',
'$firebaseObject',
'$q',
'$timeout',
'FirebaseAccess',
'WAITING',
function(
    $firebaseArray,
    $firebaseObject,
    $q,
    $timeout,
    FirebaseAccess,
    WAITING) {
    return {
        constants:{ 'waiting':'waiting', 'playing':'playing',
                'win':'win', 'draw':'draw', 'X':'X', 'O':'O' },
        create:function(X, O, newId) {
            var deferred = $q.defer()
            var games = $firebaseArray(FirebaseAccess.games())

            $timeout(function() {
                var game = {
                    id:newId,
                    status:WAITING,
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
                    var opponent = { who:waiting[0].who, ip:waiting[0].ip,
                        game:waiting[0].game }

                    waiting.$remove(0)
                    deferred.resolve(opponent)
                }
            }, 1500)
            return deferred.promise
        }, // join
        wait:function(player) {
// wait for another player
            var deferred = $q.defer()
            var waiting = $firebaseArray(FirebaseAccess.waiting())

            $timeout(function() {
                deferred.notify('waiting for another player')
                if ('undefined' === typeof waiting) {
                    deferred.reject('could not reach firebase')
                }
                else if (0 < waiting.length) {
                    deferred.reject(waiting.length) // should have joined instead
                }
                {
                    player.game = Date.now() // to locate game later
                    console.log(player)
                    waiting.$add(player).then(
                        function(success) {
// added to wait queue
                            deferred.resolve(success)
                        }
                    )
                }
            }, 1500)
            return deferred.promise
        },
        get:function(id) {
            if ('undefined' === typeof id)
                throw { name:'GameException', msg:'id not specified' }
                
            var deferred = $q.defer()
            var game = $firebaseArray(FirebaseAccess.games().orderByChild('id').equalTo(id))
                 /* should get exactly 1 */

            $timeout(function() {
                deferred.notify('retrieving game')
                if ('undefined' === game) { deferred.reject('unable to reach firebase') }
                else if (1 !== game.length) { deferred.reject('game not found')}
                else {
                    deferred.resolve($firebaseObject(game[0]))
                }
            }, 1500)
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
        games:function() { return refGames },
        waiting:function() { return refWaiting }
    }
}])
