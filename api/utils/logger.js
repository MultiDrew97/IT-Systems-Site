const fs = require('fs');
const env = require('../../bin/env');

let logs = {console: undefined, error: undefined};

class Logger {
    constructor() {
        try {
            /*
                Try to create the write streams for both logs
             */
            logs.console = fs.createWriteStream(`./logs/${env.logs.log}`, {flags: 'a'});
            logs.error = fs.createWriteStream(`./logs/${env.logs.error}`, {flags: 'a'});
        } catch (ex) {
            /*
                An error occured when trying to create the write streams for one or both of the logs
             */
            console.error('Failed to create log files', ex);
        }
    }

    error(text, data) {
        /*
            Log data to the error log
         */
        logs.error.write(data ? `${new Date().toLocaleString()} | ${text} | ${data.toString().trim()}\n` : `${new Date().toLocaleString()} | ${text}\n`)
    }

    log(text, data) {
        /*
            Log data to the console log
         */
        logs.console.write(data ? `${new Date().toLocaleString()} | ${text} | ${data.toString().trim()} \n` : `${new Date().toLocaleString()} | ${text}\n`);
    }
}

module.exports = Logger;