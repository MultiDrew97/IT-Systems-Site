angular.module('ManageCtrl', []).controller('ManageController', function($scope, $server, servers) {
    $scope.servers = servers.data;

    $scope.$on('$viewContentLoaded', ()=> {

    })
})