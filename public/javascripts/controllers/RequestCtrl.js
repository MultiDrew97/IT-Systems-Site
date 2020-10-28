angular.module('RequestCtrl', []).controller('RequestController', function($scope, $mdDialog, $login) {
    $scope.email = "";
    $scope.sendReset = function() {
        if ($scope.email !== "" && $scope.email !== null && $scope.email !== undefined) {
            $login.reset($scope.email).then(() => {
                alert('An email has been sent');
                $mdDialog.hide();
            }, reject => {
                if (reject.status === 404 ) {
                    alert("Couldn't find an account with that email address");
                } else {
                    alert("Couldn't send an email")
                }
            });
        } else {
            alert('Please enter an email address');
        }
    }
})