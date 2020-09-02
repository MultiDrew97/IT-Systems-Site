angular.module('LoginServ', []).service('$login', function($crypto, $http, $env) {
    this.checkLogin = (login) => {
        /*
            Check that the username and password are valid

            @param username username for the current login attempt
            @param password password for the current login attempt

            @return Whether the credentials are valid
         */

        return $http.get(`/api/users/login?credentials=${login}`, {headers: {
            authorization: `Basic ${$crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`)}`,
                withCredentials: true
            }})
    }
})