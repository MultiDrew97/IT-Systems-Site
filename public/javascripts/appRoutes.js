angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', '$provide', ($routeProvider, $locationProvider, $provide) => {
        $provide.decorator('$sniffer', function($delegate) {
            $delegate.history = false;
            return $delegate;
        });

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
                        return $server.get();
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
                        return $server.get();
                    },
                    cookies: function($cookies) {
                        return $cookies.getAll();
                    }
                },
                onSameUrlNavigation: 'reload'
            })

            .when('/404', {
                templateUrl: 'views/404.html'
            })

            // Not Found 404 error page
            .otherwise({
                redirectTo: '/404'
            });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            hashPrefix: '!'
        });
    }]);