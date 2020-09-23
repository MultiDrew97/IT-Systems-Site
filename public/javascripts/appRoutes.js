angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $routeProvider
            // home page
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainController'
            })

            // servers page
            .when('/servers', {
                templateUrl: 'views/servers.html',
                controller: 'ServersController',
                resolve: {
                    checked: function($server) {
                        return $server.lastChecked();
                    },
                    servers: function($server) {
                        return $server.servers();
                    }
                }
            })

            // login page
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })

            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'LogoutController'
            })

            // server management page
            .when('/servers/manage', {
                templateUrl: 'views/manage.html',
                controller: 'ManageController',
                resolve: {
                    servers: function($server) {
                        return $server.servers();
                    }
                }
            })

            // Not Found 404 error page
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        // TODO: Create all of the routes that will be used for the website.
        //  this only has a few of the routes but there are more routes planned
    }]);