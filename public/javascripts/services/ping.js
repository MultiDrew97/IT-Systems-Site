/*
    A service being used to ping servers
 */

angular.module('PingServ', []).service('$ping', function() {
    this.ping = function(server) {
        let MAX_ITERATIONS = 1;
        let TIME_PERIOD = 1;
        let i = 0;
        let REQUEST_TIMEOUT = 3000;
        let TIMEOUT_ERROR = false;

        let ping_loop = setInterval(function () {

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

                ping.open('HEAD', `https://${server.dns}`, true);
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
})