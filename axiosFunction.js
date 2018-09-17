const axios = require("axios");

exports.get = (url, contents) => {
    return axios
        .get(url, contents)
        .then(function (response) {
            console.log('GET method status : ' + response.status)
        })
        .catch(function (error) {
            console.log(error)
        })
}

exports.post = (url, contents) => {
    return axios
        .post(url, contents)
        .then(function (response) {
            console.log('POST method status : ' + response.status)
        })
        .catch(function (error) {
            console.log(error)
        })
}
