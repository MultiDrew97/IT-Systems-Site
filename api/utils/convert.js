/*
    A JSON that holds functions for converting between JSON and XML.
*/

let convert = {
    convertListXML: (options) => {
        /*
            Convert the object from XML to JSON

            @param options JSON which holds information for the conversion

            @return Array of JSON objects converted from XML
         */
        let objects = [];

        if (options.type = 'servers') {
            for (let i = 0; i < options.objects.length; i++) {
                let server = {};

                // get the information from the entry
                server.name = options.objects[i].getElementsByTagName('ServerName')[0].childNodes[0].nodeValue;
                server.ipAddress = options.objects[i].getElementsByTagName('IpAddress')[0].childNodes[0].nodeValue;
                server.status = options.objects[i].getElementsByTagName('ServerStatus')[0].childNodes[0].nodeValue;
                server.dns = options.objects[i].getElementsByTagName('DNSName')[0].childNodes[0].nodeValue;

                // append the new server into the array of objects
                objects.push(server);
            }
        } else if (options.type = 'users') {
            for (let i = 0; i < options.objects.length; i++) {
                let user = {};

                //get the user credentials
                user.displayName = options.objects[i].getElementsByTagName('DisplayName')[0].childNodes[0].nodeValue;
                user.username = options.objects[i].getElementsByTagName('Username')[0].childNodes[0].nodeValue;
                user.password = options.objects[i].getElementsByTagName('Password')[0].childNodes[0].nodeValue;

                objects.push(user);
            }
        }

        return objects;
    },
    convertJSON: (options) => {
        /*
            Convert the object from JSON to XML

            @param options JSON which holds information for the conversion

            @return The XML version of the JSON object
         */

        let xmlDoc = new XMLDocument();

        if (options.type == 'server') {
            const server = xmlDoc.createElement('Server');
            const serverName = xmlDoc.createElement('ServerName');
            const ipAddress = xmlDoc.createElement('IpAddress');
            const serverStatus = xmlDoc.createElement('ServerStatus');
            const dnsName = xmlDoc.createElement('DNSName');

            serverName.innerText = options.object.serverName;
            ipAddress.innerText = options.object.ipAddress;
            dnsName.innerText = options.object.dnsName;
            serverStatus.innerText = options.object.serverStatus;

            server.appendChild(serverName);
            server.appendChild(dnsName);
            server.appendChild(ipAddress);
            server.appendChild(serverStatus);

            return server;
            /*let servers = options.xmlDoc.getElementsByTagName('Servers')[0];

            servers.appendChild(server);*/
        } else if (options.type == 'user') {
            const user = xmlDoc.createElement('User');
            const displayName = xmlDoc.createElement('DisplayName');
            const username = xmlDoc.createElement('Username');
            const password = xmlDoc.createElement('Password');

            displayName.innerText = options.object.displayName;
            username.innerText = options.object.username;
            password.innerText = options.object.password;

            user.appendChild(displayName);
            user.appendChild(username);
            user.appendChild(password);

            return user;

            /*let users = options.xmlDoc.getElementsByTagName('Users')[0];

            users.appendChild(user);*/
        }
    }
}

/*Convert.prototype.convertLoginXML = (users_list) => {
    let users = [];

    for (let i = 0; i < users_list.length; i++) {
        let user = {};

        //get the user credentials
        user.displayName = users_list[i].getElementsByTagName('DisplayName')[0].childNodes[0].nodeValue;
        user.username = users_list[i].getElementsByTagName('Username')[0].childNodes[0].nodeValue;
        user.password = users_list[i].getElementsByTagName('Password')[0].childNodes[0].nodeValue;

        users.push(user);
    }

    return users;
}*/



module.exports = convert;