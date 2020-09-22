angular.module('LoginServ', []).service('$login', function($crypto, $http, $env, $cookies) {
    this.login = (login) => {
        /*
            Check that the username and password are valid

            @param login The login information encoded to be checked

            @return Whether the credentials are valid
         */

        return $http.get(`/api/users/login?credentials=${login}`, {headers: {
            authorization: `Basic ${$crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`)}`,
                withCredentials: true
            }})
    }

    this.logout = () => {
        $cookies.remove('credentials');
        $cookies.remove('remember');
    }
})