angular.module('CookiesServ', []).service('$cookie', function($crypto) {
    this.setCookie = (cname, cvalue, exdays) => {
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

    this.getCookie = (cname) => {
        /*
            Looks for the given cookie in the list of cookies currently stored

            @param cname(String) Name of the cookie that you are looking for
         */

        let name = `${cname}=`;
        /*let decodedCookie = decodeURIComponent(document.cookie);*/
        let ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    }

    this.checkCookie = () => {
        let credentials = this.getCookie('credentials');
        let username = $crypto.decode(credentials).split(':')[0];
        if (username !== '') {
            return true;
        } else {
            return false;
        }
    }
})