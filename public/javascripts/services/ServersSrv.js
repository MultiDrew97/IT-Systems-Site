angular.module('ServersSrv', []).service('$server', function($http, $env) {
    this.servers = function() {
        const apiAuth = `${$env.apiAuth.username}:${$env.apiAuth.password}`;
        $http.get('/api/servers', {
            headers: {
                withCredentials: true,
                authorization: `Basic ${apiAuth}`
            }
        }).then( succ => {
            console.debug(succ.data);
        }, err => {
            alert(err.message);
        })
    }
})