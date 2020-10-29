/*
        Requires for the utilities program
 */
const env = require('../../bin/env');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/*
    Global variables for the utilities program
 */
const emailer = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: env.emailing.auth.username,
        pass: env.emailing.auth.password
    }
});
const jsBase64 = require('js-base64');

utils = {
    tokens: [],
    lastChecked: undefined,
    mailOptions: {
        from: env.emailing.from,
        subject: env.emailing.subject
    },
    baseUrl: 'http://localhost:3000/',
    getAuth(authHeader) {
        return (jsBase64.decode(authHeader.split(' ')[1])).split(':');
    },
    checkAuth(auth) {
        /*
            Check the validation of the credentials given for API authorization

            @param username The username passed for authorization
            @param password The password passed for authorization

            @return Whether the credentials are valid
         */
        for (let user = 0; user < env.apiAuth.length; user++) {
            if (auth[0] === env.apiAuth[user].username && auth[1] === env.apiAuth[user].password) {
                return true;
            }
        }

        return false;
    },
    ping(server) {
        /*let MAX_ITERATIONS = 1;
        let TIME_PERIOD = 1000;
        let i = 0;*/
        let REQUEST_TIMEOUT = 3000;
        let TIMEOUT_ERROR = false;

        let ping = new XMLHttpRequest();

        ping.onreadystatechange = function() {
            if (this.readyState === 4 && !TIMEOUT_ERROR) {
                clearTimeout(timeout);
                /*console.log(`${server.serverName} up`);*/
                /*utils.servers[serverIndex].status = 'up';*/
                server.status = 'up'
                server.save((err) => {
                    if (err) {

                    }
                })
            }
        }

        ping.ontimeout = function() {
            TIMEOUT_ERROR = true;
            /*console.log(`${server.serverName} down`);*/
            server.status = 'down';
            server.save((err) => {
                if (err) {

                }
            })
        }

        /*ping.addEventListener('timeout', function () {
            console.log('timed out');
            TIMEOUT_ERROR = true;
            /!*utils.servers[serverIndex].status = 'down';
            console.log(`${server.serverName} down`);
            server.status = 'down';*!/
        })*/

        /*ping.open('HEAD', `https://${this.servers[serverIndex].dnsName}`, true);*/
        ping.open('HEAD', `http://${server.dnsName}`, true);
        /*ping.timeout = REQUEST_TIMEOUT;*/
        ping.send();

        let timeout = setTimeout(function() {
            ping.ontimeout();
            ping.abort();
        }, REQUEST_TIMEOUT)
        /*let ping_loop = setInterval(function () {

            if (i < MAX_ITERATIONS) {
                let ping = new XMLHttpRequest();

                i++;
                ping.seq = i;

                ping.date1 = Date.now();

                ping.timeout = REQUEST_TIMEOUT;

                ping.onreadystatechange = function () {
                    if (ping.readyState === 4 && !TIMEOUT_ERROR) {
                        utils.servers[serverIndex].status = 'up';
                    }
                }

                ping.ontimeout = function () {
                    TIMEOUT_ERROR = true;
                }

                ping.open('HEAD', `https://${this.servers[serverIndex].dnsName}`, true);
                ping.send();
            }

            if (TIMEOUT_ERROR) {
                clearInterval(ping_loop);
            }
        }, TIME_PERIOD);*/
    },
    convertTime(time, unit) {
        if (unit === 'seconds'){
            return time * 1000;
        } else if (unit === 'minutes' || unit === 'minutes') {
            return time * 60000;
        } else if (unit === 'hours' || unit === 'hour') {
            return time * 3600000;
        } else if (unit === 'days' || unit === 'day') {
            return time * 86400000;
        } else if (unit === 'years' || unit === 'year') {
            return time * 31536000000;
        }
    },
    checkServers(servers) {
        for (let i = 0; i < servers.length; i++) {
            if (servers[i].status !== 'maintenance') {
                this.ping(servers[i]);
            }
        }

        // TODO: Decide how to send notification that there are servers down

        this.lastChecked = Date.now();
        /*this.saveData(null, true);*/
    },
    sendEmail(user) {
        let message = `<!DOCTYPE html><html lang="en"><body><div id="email-content" style="display: inline-flex; flex-direction: column; margin-left: 30%"><h1 class="title" style="text-align: center;">Password Reset</h1>` +
            `<div id="email-body" ><p class="text">We received a request to reset your password, which can be accessed below.</p><br/>` +
            `<p class="text">If you didn't request this reset, you can disregard this message.</p></div>` +
            `<a style="text-align: center;" id="reset-link" href="${this.baseUrl}login/reset?p0=${jsBase64.encode(JSON.stringify(user), true)}&p1=${this.generateToken()}">Reset Password</a><hr/>` +
            `<p>AGIT</p></div></body></html>`;

        let email = this.mailOptions;
        email.to = user.email;
        /*
            TODO: Figure out how to create a time limit on the reset link
         */
        email.html = message
        return emailer.sendMail(email);
    },
    generateToken() {
        // generate a token to be used for validation in the website in terms of resets and such
        let generated = crypto.randomBytes(256);
        this.tokens.push({token: generated.toString('hex'), valid: true, created: Date.now(), validTil: Date.now() + this.convertTime(10, 'minutes')})
        return generated.toString('hex');
    },
    validToken(token) {
        for(let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].token === token) {
                if (this.tokens[i].valid) {
                    if (Date.now() <= this.tokens[i].validTil) {
                        this.tokens[i].valid = false;
                        return true
                    } else {
                        this.tokens[i].valid = false;
                    }
                }
            }
        }

        return false;
    }
}
module.exports = utils;