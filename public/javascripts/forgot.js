let body;
const api = `${btoa('admin:password')}`
let newPassword;
let confirmPassword;

function getUrlParams() {
    console.log('Getting Params')
    let params = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        params[key] = value;
    })

    body = JSON.parse(atob(params['p0']));
}

function changePassword(e) {
    e.preventDefault() // prevents the form from submitting itself
    console.log('Submitting Form');
    if (newPassword.checkValidity()) {
        if (confirmPassword.checkValidity()) {
            body.password = btoa(newPassword.value);

            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        window.open('/login/reset/success', '_parent', 'width=auto,height=auto', true)
                    } else {
                        newPassword.value = ""
                        confirmPassword.value = ""
                        alert('Failed to update your password. Please try again.');
                    }
                }
            })

            xhr.open('PUT', '/api/users/login');
            xhr.setRequestHeader('authorization', `Basic ${api}`);
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(body));
        } else {
            document.querySelector('#message').innerText = confirmPassword.validationMessage;
        }

    } else {
        document.querySelector('#message').innerText = newPassword.validationMessage;
    }
}

function checkMatching(input) {
    if (input.value !== newPassword.value) {
        //passwords don't match
        input.setCustomValidity('Passwords must match')
    } else {
        // Passwords match
        input.setCustomValidity('');
    }
}

function loadPage() {
    getUrlParams();
    newPassword = document.querySelector('#new-password');
    confirmPassword = document.querySelector('#confirm-password');
    newPassword.focus();
}