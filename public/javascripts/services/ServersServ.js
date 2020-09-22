angular.module('ServersServ', []).service('$server', function($http, $env, $crypto) {
    const apiAuth = $crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`);

    this.servers = function() {
        return $http.get('/api/servers', {
            headers: {
                withCredentials: true,
                authorization: `Basic ${apiAuth}`
            }
        })
    }

    this.updateServer = function(ipAddress, server) {
        return $http.put(`/api/server?ipAddress=${ipAddress}`, server, {
            headers: {
                withCredentials: true,
                authorization: `basic ${apiAuth}`
            }
        })
    }

    this.lastChecked = function() {
        return $http.get('/api/servers/checked', {
            headers: {
                withCredentials: true,
                authorization: `Basic ${apiAuth}`
            }
        });
    }
})