angular.module('LoginCtrl', []).controller('LoginController', function($scope, $location, $login, $crypto, $env) {
    // this allows the login button to be 'clicked' when the enter button is pressed
    document.querySelector('#login-form').addEventListener('keyup', event => {
        if (event.key !== "Enter") return; //checks if the button pressed was not the enter button
        document.querySelector('#login').click(); // perform the button click when the button is confirmed to be the enter button
        event.preventDefault(); // keeps from pressing other buttons on the page
    });

    $scope.$on('$viewContentLoaded', function() {
        /*console.debug(document.querySelector('#keepSignedIn').value);*/
        document.querySelector('#username').focus();
    });

    $scope.keepSignedIn = false;

    $scope.signIn = function() {
        const loginEncoded = $crypto.encode(`${$scope.username}:${$scope.password}`);
        /*const apiEncoded = $crypto.encode(`${$env.apiAuth.username}:${$env.apiAuth.password}`);*/

        $login.checkLogin(loginEncoded).then(succ => {
            if (succ.data.valid) {
                alert('Login Successful');

                if ($scope.keepSignedIn) {
                    setCookie('credentials', loginEncoded, 14);

                    console.debug(`DEBUG: ${document.cookie}`);
                }

                $location.path('/servers/manage');
            } else {
                document.querySelector('#password').value = "";
                alert('Login Failed');
            }
        }, err => {
            alert(err);
        });

    }

    function setCookie(cname, cvalue, exdays) {
        /*
            Sets the values of the cookie with the determined lifespan

            @param cname Name of the value being stored for the cookie
            @param cvalue Value being stored in cookie
            @param exdays Number of days the
        */
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));

        let expires = `expires=${d.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    function getCookie(cname) {
        /*
            Looks for the given cookie in the list of cookies currently stored

            @param cname(String) Name of the cookie that you are looking for
         */

        let name = `${cname}=`;
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for (let i in ca) {
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOF(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }

    function checkCookie() {
        let credentials = getCookie('credentials');
        let username = $crypto.decode(credentials).split(':')[0];
        let password = $crypto.decode(credentials).split(':')[1];
        if (username != '') {
            alert(`welcome again ${username}`);
        } else {
            username = prompt("Please enter your name:", "");
            if (username != "" && username != null) {
                setCookie("username", username, 60);
            }
        }
    }
})