const moment = require('moment')

function formatMessage(username,text) {
    return {
        // got a suspiscion this is not working
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage