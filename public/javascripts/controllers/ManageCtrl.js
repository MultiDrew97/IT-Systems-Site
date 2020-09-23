angular.module('ManageCtrl', []).controller('ManageController', function($scope, $server, $mdDialog, servers) {
    /*
        IP Address Regular Expression

        ^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
     */

    $scope.selection = {
        edit: null,
        removals: null
    }

    $scope.selected = false;

    $scope.serverList = servers.data;

    $scope.changed = function () {
        if ($scope.selection.edit != "") {
            $scope.oldIpAddress = $scope.selection.edit.ipAddress;
            /*$scope.selectedServer = JSON.parse($scope.selectedServer);
            console.log($scope.selectedServer);*/
            $scope.selected = true;
        } else {
            $scope.selected = false;
        }
    }

    $scope.confirmRemoval = function () {
        console.log($scope.selection.removals);
        let message = $scope.selection.removals.length > 1 ? 'Are you sure you want to remove this server from the watch list?': `Are you sure you want to remove ${$scope.selection.removals.length} from the watch list?`
        if (confirm(message)) {
            for (let i = 0; i < $scope.selection.removals.length; i++) {
                $server.removeServer($scope.selection.removals[i].ipAddress)
            }

            $route.reload();
        }
    }

    $scope.changeFrequency = function () {
        // TODO: Create a popup to change the checking frequency of the servers
    }

    $scope.updateServer = function () {
        console.log($scope.selection.edit);

        if ($scope.selection.edit.ipAddress === $scope.oldIpAddress) {
            //check for if it's a maintenance update
        }

        $route.reload();
    }

    $scope.clearSelection = function () {
        let options = document.querySelector('#remove-servers').options;

        options.selectedIndex = -1;
        /*for (let i = 0; i < options.length; i++) {
            options.selected = false;
        }*/
    }

    $scope.$on('$viewContentLoaded', ()=> {

    })
});