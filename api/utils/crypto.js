
function Crypto(){}

Crypto.prototype.encode = (value) => {
    /*
        Encode the value using the algorithm

        @param value Value that is needed to be encrypted

        @return Encrypted value
     */
    return window.btoa(window.btoa(value));
}

Crypto.prototype.decode = (value) => {
    /*
        Decode the value using the algorithm

        @param value Value that is needed to be decrypted

        @return Decrypted value
     */
    return window.atob(window.atob(value));
}

module.exports = Crypto;