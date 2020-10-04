angular.module('ForgotCtrl', []).controller('ForgotController', function($mdDialog, $scope, $routeParams, $crypto) {
    $scope.changePassword = function() {
        if ($scope.newPassword === $scope.confirmPassword) {
            // TODO: Implement the actual changing of the password
            $login.reset($crypto.encode($scope.newPassword));
            $mdDialog.hide();
        } else {
            alert('Passwords did not match');
        }
    }

    console.log($routeParams);

    $scope.cancel = function() {
        $mdDialog.hide();
    }
});