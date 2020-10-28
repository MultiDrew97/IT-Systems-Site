angular.module('FrequencyCtrl', []).controller('FrequencyController', function($scope, $server, $mdDialog) {
    $scope.frequency = 0;

    $server.getFrequency().then(res => {
        $scope.frequency = res.data.interval;
    })


    $scope.changeFrequency = function() {
        /*alert($scope.frequency);*/
        $server.changeFrequency({interval: $scope.frequency}).then(() => {
            $mdDialog.hide();
        }, fail => {
            console.log(fail);
        })
    }
})