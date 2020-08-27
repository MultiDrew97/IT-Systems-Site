angular.module('LoginServ', []).service('$login', function($xmlConvert, $crypto, $http) {
    const path = '../../res/data/login.xml';
    let users = [];

    this.loadCredentials = () => {
        /*

            Load the user credentials from the xml database file



         */
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && (xhttp.status === 200 || xhttp.status === 304)) {
                users = $xmlConvert.convertLoginXML(xhttp.responseXML.getElementsByTagName('User'));
            }
        }

        xhttp.open('GET', path, true);
        xhttp.send();
    }

    this.checkLogin = (username, password) => {
        /*
            Check that the username and password are valid

            @param username username for the current login attempt
            @param password password for the current login attempt

            @return Whether the credentials are valid
         */
        let userIndex = userExists(username);
        if (userIndex >= 0) {
            console.log(btoa(btoa('password')));
            return $crypto.decode(users[userIndex].password) === password;
        }
    }

    const userExists = (username) => {
        /*

            Determine whether the username exists in the database

            @param username username for the current attempt

            @return Index of the user in the list if they exist, -1 if they do not
         */
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username)
            return i;
        }

        return -1;
    }

    this.createUser = (displayName, username, password) => {
        /*
            Create a login for a new user

            @param displayName the name that will be displayed on the website
            @param username the username for the new user
            @param password the password for the new user

            @return Whether the user was successfully created
         */
        let user = {
            displayName: displayname,
            username: username,
            password: $crypto.encode(password)
        }

        if (userExists(username) === -1) {
            users.push(user);
            let userXML = $xmlConvert.convertLoginJSON(user);

            const xhttp = new XMLHttpRequest();
            let xml;

            xhttp.onreadystatechange = () => {
                if (this.readystate === 4 && (this.status === 200 || this.status === 304)) {
                    xml = this.responseXML;
                }
            }

            setTimeout(function(){
                const usersXML = xml.getElementsByTagName('Users');
                usersXML.appendChild(userXML);

            }, 300)
        }

        //return false;




        $http.post('/api/users', user);

        return false
    }

    console.debug(users);
})