/*
    A service to be used to handle the crypto security of the passwords
*/

angular.module('CryptoServ', []).service('$crypto', function() {
    this.encode = (value) => {
        /*
            Encode the value using the algorithm

            @param value Value that is needed to be encrypted

            @return Encrypted value
         */
        return btoa(value);
    }

    this.decode = (value) => {
        /*
            Decode the value using the algorithm

            @param value Value that is needed to be decrypted

            @return Decrypted value
         */
        return atob(value);
    }
})