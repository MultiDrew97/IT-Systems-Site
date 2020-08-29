angular.module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
        $routeProvider
            // home page
            .when('/', {
                templateUrl: 'views/home.html'
            })

            // servers page
            .when('/servers', {
                templateUrl: 'views/servers.html',
                controller: 'ServersController'
            })

            // login page
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })

            /*.when('/api/users', {
                controller: 'UsersController'
            })*/

            // Not Found 404 error page
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
        // TODO: Create all of the routes that will be used for the website.
        //  this only has a few of the routes but there are more routes planned
    }]);