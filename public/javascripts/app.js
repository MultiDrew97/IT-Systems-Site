let app = angular.module('IT-Systems',
    ['ngRoute', 'appRoutes', 'ServersCtrl', 'LoginCtrl', 'SXCServ', 'PingServ']);

/*
app.service('$serverXmlConvert', function() {
    this.convertXML = function(server_list) {
        let servers = [];

        for (let i = 0; i < server_list.length; i++) {
            let server = {};

            // get the information from the entry
            server.name = server_list[i].getElementsByTagName('ServerName')[0].childNodes[0].nodeValue;
            server.ipAddress = server_list[i].getElementsByTagName('IpAddress')[0].childNodes[0].nodeValue;
            server.status = server_list[i].getElementsByTagName('ServerStatus')[0].childNodes[0].nodeValue;

            // append the new server into the array of servers
            servers.push(server);
        }

        return servers;
    }
})*/
