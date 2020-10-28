angular.module('MainCtrl', []).controller('MainController', function($location, $scope, $cookies, $login, $mdDialog, $location, $route) {
    const loginLink = document.querySelector('#login-link');
    /*const ngClick = document.createAttribute('ng-click');
    ngClick.value = 'loginPopup()';*/

    $scope.creds = false;

    window.addEventListener('beforeunload', e => {
        if (detectRefresh()) {

        } else {
            if (!$cookies.get('remember')) {
                $login.logout();
            }
        }
    })

    $scope.$on('$viewContentLoaded', function() {
        if ($cookies.get('credentials')) {
            foundCreds();
        } else {
            loginLink.innerText = 'Login'
            loginLink.style.left = '80%';
            const checkInterval = setInterval(() => {
                if ($cookies.get('credentials')) {
                    foundCreds();
                    clearInterval(checkInterval);

                }
            }, 100);
        }
    })

    $scope.popup = function(ev) {
        const popup = {
            parent: angular.element(document.body),
            targetEvent: ev
        }

        let innerText;

        if(loginLink.innerText === 'Login') {
            popup.controller = 'LoginController';
            popup.templateUrl = 'views/login.html';
            popup.clickOutsideToClose = true;

            innerText = 'Logout';
        } else if (loginLink.innerText === 'Logout') {
            popup.controller = 'LogoutController';
            popup.templateUrl = 'views/logout.html';
            popup.clickOutsideToClose = false;
            $scope.creds = false;
            innerText = 'Login';
        }

        $mdDialog.show(popup).then(() => {
            loginLink.innerText = innerText;
            $route.reload();
        })
    }

    function detectRefresh() {
        console.log(window.localStorage);
        console.log(window.sessionStorage);
        try {
            if (window.localStorage === undefined) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    function foundCreds() {
        $scope.creds = true;
        loginLink.style.left = '65%';
        loginLink.innerText = 'Logout';
    }
});