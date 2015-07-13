var app = angular.module('tic-tac-toe', ['ngGrid'])

app.controller('GameCtrl', ['$scope', function($scope) {
    $scope.gameData = [
        { col1:'X', col2:'O', col3:'X' }
    ]
    $scope.gridOptions = {
        data: 'gameData'
    }
}])
