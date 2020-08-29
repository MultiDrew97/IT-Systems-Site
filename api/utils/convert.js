/*
    A service used to convert XML data for server information into JSON format and vise versa.
*/

function Convert() {}

Convert.prototype.convertServerXML = (server_list) => {
    let servers = [];

    for (let i = 0; i < server_list.length; i++) {
        let server = {};

        // get the information from the entry
        server.name = server_list[i].getElementsByTagName('ServerName')[0].childNodes[0].nodeValue;
        server.ipAddress = server_list[i].getElementsByTagName('IpAddress')[0].childNodes[0].nodeValue;
        server.status = server_list[i].getElementsByTagName('ServerStatus')[0].childNodes[0].nodeValue;
        server.dns = server_list[i].getElementsByTagName('DNSName')[0].childNodes[0].nodeValue;

        // append the new server into the array of servers
        servers.push(server);
    }

    return servers;
}

Convert.prototype.convertLoginXML = (users_list) => {
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
}

Convert.prototype.convertLoginJSON = (user) => {
    /*
        Convert the user into XML from JSON

        @param user The user JSON that is being converted to XML

        @return The XML version of the JSON object
     */

    let xmlDoc = new XMLDocument();
    /*
    const xhttp = new XMLHttpRequest()

    xhttp.onreadystatechange = () => {
        if (this.readystate === 4 && (this.status === 200 || this.status === 304)) {
            xmlDoc = this.responseXML;
        }
    }

    xhttp.open('GET', database, true);
    xhttp.send();
    */
    //setTimeout(function() {
        const userXML = xmlDoc.createElement('User');
        const displayNameXML = xmlDoc.createElement('DisplayName');
        const usernameXML = xmlDoc.createElement('Username');
        const passwordXML = xmlDoc.createElement('Password');

        displayNameXML.innerText = user.displayName;
        usernameXML.innerText = user.username;
        passwordXML.innerText = user.password;

        userXML.appendChild(displayNameXML);
        userXML.appendChild(usernameXML);
        userXML.appendChild(passwordXML);

        const users = xmlDoc.getElementsByTagName('Users')[0];

        users.appendChild(userXML);

        return users;
    //},300)

}

module.exports = Convert;