angular.module('LoginCtrl', []).controller('LoginController', function($scope, $login) {
    // this allows the login button to be 'clicked' when the enter button is pressed
    document.querySelector('#login-form').addEventListener('keyup', event => {
        if (event.key !== "Enter") return; //checks if the button pressed was not the enter button
        document.querySelector('#login').click(); // perform the button click when the button is confirmed to be the enter button
        event.preventDefault(); // keeps from pressing other buttons on the page
    });

    $scope.keepSignedIn = false;
    $login.loadCredentials();

    $scope.signIn = function() {
        if($login.checkLogin($scope.username, $scope.password)) {
            alert('Login Successful');

            if ($scope.keepSignedIn) {
                setCookie('username', $scope.username, 14);
                setCookie('password', btoa(btoa($scope.password)), 14);

                console.debug(`DEBUG: ${document.cookie}`);
            }

            console.debug(`DEBUG: Keep Signed In - ${$scope.keepSignedIn}`);
        } else {
            document.querySelector('#password').innerText = "";
            alert('Login Failed');
        }
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
        let username = getCookie('username');
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