angular.module('LoginCtrl', []).controller('LoginController', function($scope) {
    $scope.keepSignedIn = false;

    $scope.signIn = function() {
        if ($scope.keepSignedIn) {
            setCookie('username', $scope.username, 60);
            setCookie('password', btoa(btoa($scope.password)), 60);

            console.debug(`DEBUG: ${document.cookie}`);
        }

        console.debug(`DEBUG: Keep Signed In - ${$scope.keepSignedIn}`);
    }

    function setCookie(cname, cvalue, exdays) {
        /*
            Sets the values of the cookie with the determined lifespan

            @param cname(String) Name of the value being stored for the cookie
            @param cvalue(String) Value being stored in cookie
            @param exdays(Number) Number of days the
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