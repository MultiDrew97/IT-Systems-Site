angular.module('MainCtrl', []).controller('MainController', function($location, $scope, $cookies, $login, $mdDialog, $location, $route) {
    const loginLink = document.querySelector('#login-link');
    /*const ngClick = document.createAttribute('ng-click');
    ngClick.value = 'loginPopup()';*/

    window.addEventListener('beforeunload', e => {
        if (!$cookies.get('remember')) {
            $login.logout();
        }
    })

    $scope.$on('$viewContentLoaded', function() {
        if ($cookies.get('credentials')) {
            loginLink.innerText = 'Logout';
        } else {
            loginLink.innerText = 'Login'
            const checkInterval = setInterval(() => {
                if ($cookies.get('credentials')) {
                    console.debug('credentials found')
                    clearInterval(checkInterval);
                    loginLink.innerText = 'Logout';
                }
            }, 100);
        }
    })

    $scope.popup = function(ev) {
        if(loginLink.innerText === 'Login') {
            $mdDialog.show({
                controller: 'LoginController',
                templateUrl: 'views/login.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(() => {
                loginLink.innerText = 'Logout';
                $route.reload();
            })
        } else if (loginLink.innerText === 'Logout') {
            $mdDialog.show({
                controller: 'LogoutController',
                templateUrl: 'views/logout.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            }).then(() => {
                loginLink.innerText = 'Login';
                $route.reload();
            })
        }
    }
});