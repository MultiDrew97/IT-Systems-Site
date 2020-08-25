angular.module('ServersCtrl', []).controller('ServersController', function($scope, $serverXmlConvert) {
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
        let tableBody = document.getElementById('server-info')

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
                        $scope.ping($scope.servers[server]);
                    }
                }
            }, 500)
        }, 1000)
    });

    $scope.ping = function(server) {
        let MAX_ITERATIONS = 1;
        let TIME_PERIOD = 1;
        let i = 0;
        let REQUEST_TIMEOUT = 3000;
        let TIMEOUT_ERROR = false;

        let ping_loop = setInterval(function() {

            if (i < MAX_ITERATIONS) {
                let ping = new XMLHttpRequest();

                i++;
                ping.seq = i;

                ping.date1 = Date.now();

                ping.timeout = REQUEST_TIMEOUT;

                ping.onreadystatechange = function () {
                    if (this.readyState === 4 && !TIMEOUT_ERROR) {
                        document.getElementById(server.name).style.backgroundColor = "greenyellow";
                        console.debug(`DEBUG: ${server.name} is up`)
                        server.status = "up";
                    }
                }

                ping.ontimeout = function () {
                    TIMEOUT_ERROR = true;
                }

                ping.open('HEAD', `https://${server.ipAddress}`, true);
                ping.send();
            }

            if (TIMEOUT_ERROR) {
                clearInterval(ping_loop);
                document.getElementById(server.name).style.backgroundColor = "red";
                console.debug(`DEBUG: ${server.name} is down`)
                server.status = "down";
            }
        }, TIME_PERIOD);


        /*let xhttp = new XMLHttpRequest();

        for (let server in $scope.servers) {
            xhttp.onreadystatechange = () => {
                if (this.readyState === 4 && this.status === 200) {
                    server.status = 'down';
                }
            };

            xhttp.open('get', `\\\\${server.ipAddress}`, true);
            xhttp.send();
        }*/
    }
});