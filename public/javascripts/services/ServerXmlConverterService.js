/*
    A service used to convert XML data for server information into JSON format and vise versa.
*/

angular.module('SXCServ', []).service('$serverXmlConvert', function() {
    this.convertXML = function(server_list) {
        let servers = [];

        for (let i = 0; i < server_list.length; i++) {
            let server = {};

            // get the information from the entry
            server.name = server_list[i].getElementsByTagName('ServerName')[0].childNodes[0].nodeValue;
            server.ipAddress = server_list[i].getElementsByTagName('IpAddress')[0].childNodes[0].nodeValue;
            server.status = server_list[i].getElementsByTagName('ServerStatus')[0].childNodes[0].nodeValue;
            server.dns = server_list[i].getElementsByTagname('DNSName')[0].childNodes[0].nodeValue;

            // append the new server into the array of servers
            servers.push(server);
        }

        return servers;
    }
});