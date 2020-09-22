angular.module('LoginCtrl', []).controller('LoginController', function($scope, $location, $login, $crypto, $env, $cookie, $mdDialog, $route) {
    // this allows the login button to be 'clicked' when the enter button is pressed

    $scope.$on('$viewContentLoaded', function() {
        /*console.debug(document.querySelector('#keepSignedIn').value);*/
        document.querySelector('#username').focus();
        /*document.querySelector('#login-form').addEventListener('keyup', event => {
            if (event.key !== "Enter") return; //checks if the button pressed was not the enter button
            document.querySelector('#login').click(); // perform the button click when the button is confirmed to be the enter button
            event.preventDefault(); // keeps from pressing other buttons on the page
        });*/
    });

    $scope.keepSignedIn = false;

    $scope.signIn = function() {
        const loginEncoded = $crypto.encode(`${$scope.username}:${$scope.password}`);
        /*const apiEncoded = $crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`);*/

        $login.login(loginEncoded).then(succ => {
            let length = 1;

            if (succ.data.valid) {
                alert('Login Successful');

                if ($scope.keepSignedIn) {
                    length = 365;

                    $cookie.setCookie('remember', true, length);
                }

                $cookie.setCookie('credentials', loginEncoded, length);
                /*document.querySelector('#login-link').attributes.getNamedItem('ng-href').value = '/logout';
                document.querySelector('#login-link').attributes.getNamedItem('href').value = '/logout';
                document.querySelector('#login-link').attributes.removeNamedItem('ng-click');*/
                $mdDialog.hide();
            } else {
                document.querySelector('#password').value = "";
                alert('Login Failed');
            }
        }, err => {
            alert(err);
        });

    }
})