angular.module('ServersCtrl', []).controller('ServersController', function($scope) {
    $scope.servers = [
        {
            name: 'Mas-90',
            status: 'down',
            icon: 'red'
        }, {
            name: 'Master Gastro',
            status: 'up',
            icon: 'green'
        }, {
            name: 'Data Drive',
            status: 'Maintenance',
            icon: 'yellow'
        }
    ]
});