/*
    A service used to convert XML data for server information into JSON format and vise versa.
*/

angular.module('ServersCtrl', []).controller('ServersController', function($scope, $serverXmlConvert, $ping) {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 304)) {
            $scope.servers = $serverXmlConvert.convertXML(xhttp.responseXML.getElementsByTagName('Server')); // import xml data
            console.log($scope.servers);
        }
    }

    xhttp.open('GET', '../../res/data/servers.xml', true);
    xhttp.send();

    $scope.$on('$viewContentLoaded', function() {
        let tableBody = document.getElementById('servers')

        setTimeout(function() {
            const statusClass = 'status-light ';

            for (let i in $scope.servers) {
                /*
                STRUCTURE FOR TABLE INFO

                <tr>
                    <td class="server-name"> {{ server.name }} </td>
                    <td class="status"><p class="status-light {{ server.status }}" id="{{ server.name }}"></p></td>
                </tr>
                */

                // create and initialize the elements
                let tableRow = document.createElement('tr');
                let serverName = document.createElement('td');
                serverName.className = 'server-name'
                let status = document.createElement('td');
                status.className = 'status';
                let statusLight = document.createElement('p');

                // insert info into elements
                serverName.innerText = $scope.servers[i].name;
                statusLight.className = statusClass + $scope.servers[i].status;
                statusLight.id = $scope.servers[i].name;

                // add the table row to the table on the page
                status.appendChild(statusLight)
                tableRow.appendChild(serverName)
                tableRow.appendChild(status)
                tableBody.appendChild(tableRow);
            }

            setTimeout(function(){
                if ($scope.servers != undefined) {
                    console.debug("DEBUG: PINGING SERVERS");
                    for (let server in $scope.servers) {
                        console.debug(`DEBUG: PINGING ${$scope.servers[server].name}`)
                        $ping.ping($scope.servers[server]);
                    }
                }
            }, 500)
        }, 100)
    });
});