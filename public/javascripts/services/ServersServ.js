angular.module('ServersServ', []).service('$server', function($http, $env, $crypto) {
    const apiAuth = $crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`);

    return {
        get: function () {
            return $http.get('/api/servers', {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        },
        update: function (ipAddress, server) {
            return $http.put(`/api/servers?p0=${ipAddress}`, server, {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        },
        lastChecked: function () {
            return $http.get('/api/servers/checked', {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            });
        },
        delete: function (ipAddress) {
            return $http.delete(`/api/servers?p0=${ipAddress}`, {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        },
        post : function (server) {
            return $http.post('/api/servers', server, {
                headers : {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        },
        getFrequency: function() {
            return $http.get('/api/servers/timer', {
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        },
        changeFrequency: function(frequency) {
            return $http.put('/api/servers/timer', frequency,{
                headers: {
                    withCredentials: true,
                    authorization: `Basic ${apiAuth}`
                }
            })
        }
    }
})