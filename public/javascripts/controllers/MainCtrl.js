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
        const popup = {
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        }

        let innerText;

        if(loginLink.innerText === 'Login') {
            popup.controller = 'LoginController';
            popup.templateUrl = 'views/login.html';
            innerText = 'Logout';
        } else if (loginLink.innerText === 'Logout') {
            popup.controller = 'LogoutController';
            popup.templateUrl = 'views/logout.html';
            innerText = 'Login';
        }

        $mdDialog.show(popup).then(() => {
            loginLink.innerText = innerText;
            $route.reload();
        })
    }
});