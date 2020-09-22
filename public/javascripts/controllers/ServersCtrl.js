angular.module('ServersCtrl', []).controller('ServersController', function($scope, $server, $crypto, $cookies, $location, $route, checked, servers) {
    $scope.lastChecked = checked.data.date || 'Has not been checked yet';
    $scope.servers = servers.data;

    window.addEventListener('beforeunload', e => {
        $route.reload();
    })

    $scope.$on('$viewContentLoaded', function() {
        setTimeout(function() {
            if ($cookies.get('credentials')) {
                let columns = document.getElementsByClassName('hidden');
                /*let table = document.querySelector('#server-table');
                table.lastChild.lastChild.style.visibility = 'visible';*/
                for (let i = 0; i < columns.length; i++) {
                    columns[i].style.visibility = 'visible';
                }
            }
        }, 50)

        /*let tableBody = document.getElementById('servers')

        setTimeout(function() {
            const statusClass = 'status-light ';

            for (let i = 0; i < $scope.servers.length; i++) {
                /!*
                STRUCTURE FOR TABLE INFO

                <tr>
                    <td class="server-name"> {{ server.name }} </td>
                    <td class="status"><p class="status-light {{ server.status }}" id="{{ server.name }}"></p></td>
                </tr>
                *!/

                // create and initialize the elements
                let tableRow = document.createElement('tr');
                let serverName = document.createElement('td');
                serverName.className = 'server-name'
                let status = document.createElement('td');
                status.className = 'status';
                let statusLight = document.createElement('p');

                // insert info into elements
                serverName.innerText = $scope.servers[i].serverName;
                statusLight.className = statusClass + $scope.servers[i].status;
                statusLight.id = $scope.servers[i].name;

                // add the table row to the table on the page
                status.appendChild(statusLight)
                tableRow.appendChild(serverName)
                tableRow.appendChild(status)
                tableBody.appendChild(tableRow);
            }
        }, 100)*/
    });

    $scope.editServerInfo = function(server) {
        console.debug(server);
        window.open(`http://localhost:3000/servers/edit?ipAddress=${server.ipAddress}`, 'MsgWindow');
    }

    $scope.loggedIn = function() {
        return $cookies.get('credentials') != undefined;
    }
});