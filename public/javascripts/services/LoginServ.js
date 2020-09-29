angular.module('LoginServ', []).service('$login', function($crypto, $http, $env, $cookies) {
    const apiAuth = $crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`);
    return {
        login: (login) => {
            /*
                Check that the username and password are valid

                @param login The login information encoded to be checked

                @return Whether the credentials are valid
             */

            return $http.get(`/api/users/login?p0=${login}`, {
                headers: {
                    authorization: `Basic ${apiAuth}`,
                    withCredentials: true
                }
            })
        },
        logout: () => {
            // Clears the cookies from the browser to ensure a logout
            $cookies.remove('credentials');
            $cookies.remove('remember');
        },
        reset: (username, newPassword) => {
            $http.put(`/api/users/login?p0=${username}`, {newPassword: newPassword}, {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        }
    }
})