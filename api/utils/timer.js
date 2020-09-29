function Timer(fn, t) {
    let timerObj = setInterval(fn, t);

    this.start = function() {
        if (!this.timerObj) {
            this.stop();
            this.timerObj = setInterval(fn, t)
        }

        return this;
    }

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }

        return this;
    }

    this.reset = function(newTime = t) {
        t = newTime;
        return this.stop().start();
    }
}

module.exports = Timer;