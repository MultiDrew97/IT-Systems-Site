angular.module('LogoutCtrl', []).controller('LogoutController', function($scope, $cookies, $location, $login, $route, $mdDialog) {
    console.log('Cookies before removal:', $cookies.getAll());

    $login.logout();
    $cookies.remove('lastChecked');

    console.log('Cookies after removal:', $cookies.getAll());

    $scope.timer = 3;

    let timer = setInterval(function() {
        document.querySelector('#timer').innerText = $scope.timer - 1;
        $scope.timer -= 1;

        if ($scope.timer === 0)
            clearInterval(timer);
    }, 1000)

    /*const logout = document.querySelector('#login-link');
    logout.attributes.getNamedItem('href').value = '/';
    logout.innerText = 'Login';*/

    setTimeout(function() {
        /*$location.path('/');
        $route.reload();*/
        $mdDialog.hide();
    }, 3000)
})