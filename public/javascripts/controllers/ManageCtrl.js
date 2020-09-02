angular.module('ManageCtrl', []).controller('ManageController', function($scope, $server) {
    $scope.$on('$viewContentLoaded', ()=> {
        document.querySelector('#login-link');
    })
})