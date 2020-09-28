angular.module('ManageCtrl', []).controller('ManageController', function($scope, $server, $mdDialog, $env, $cookies, $route, servers, cookies) {
    /*
        IP Address Regular Expression

        ^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
     */

    $scope.selection = {
        edit: null,
        removals: null
    }

    $scope.newServer = {};

    $scope.selected = false;

    $scope.serverList = servers.data;

    $scope.granted = cookies.credentials != undefined

    $scope.changed = function () {
        if ($scope.selection.edit != "") {
            $scope.oldIpAddress = $scope.selection.edit.ipAddress;
            console.log($scope.oldIpAddress);
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
                $server.delete($scope.selection.removals[i].ipAddress)
            }

            $route.reload();
        }
    }

    $scope.changeFrequency = function () {
        // TODO: Create a popup to change the checking frequency of the servers

        // TODO: In popup, use a dropdown (select) to have preset checking intervals
        /*$mdDialog.show({

        })*/
    }

    $scope.updateServer = function () {
        console.log($scope.selection.edit);

        $server.update($scope.oldIpAddress, $scope.selection.edit).then(() => {
            $route.reload();
        }, failure => {
            console.log(failure);
        });
    }

    $scope.clearSelection = function () {
        document.querySelector('#remove-servers').options.selectedIndex = -1;
        /*for (let i = 0; i < options.length; i++) {
            options.selected = false;
        }*/
    }

    $scope.optionChanged = function () {
        let radios = document.getElementsByName('management');

        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                $cookies.put('option', radios[i].id, $env.cookieOptions(1));
            }
        }

        console.log($cookies.get('option'));
    }

    $scope.addServer = function() {
        const errors = [];
        let message = "";

        if (!uniqueDNS($scope.newServer.dnsName)) {
            errors.push('DNS already exists')
            document.querySelector('#newDNSName').value = "";
        }

        if (!uniqueIP($scope.newServer.ipAddress)) {
            errors.push('IP already exists')
            document.querySelector('#newIPAddress').value = "";
        }

        if (errors.length == 0) {
            $server.post($scope.newServer)
            $route.reload();
        } else {
            for (let i = 0; i < errors.length; i++) {
                message += ` * ${errors[i]}\n`;
            }

            alert(`There were issues with your addition.\n\n${message}`)
        }
    }

    $scope.$on('$viewContentLoaded', ()=> {
        $scope.option = $cookies.get('option') || "";
    })

    function uniqueDNS(dnsName) {
        for (let i = 0; i < $scope.serverList.length; i++) {
            if (dnsName === $scope.serverList[i].dnsName) {
                return false;
            }
        }

        return true;
    }

    function uniqueIP(ipAddress) {
        for (let i = 0; i < $scope.serverList.length; i++) {
            if (ipAddress === $scope.serverList[i].ipAddress) {
                return false;
            }
        }

        return true;
    }
});