const crypto = require('crypto');

function generatePassword() {
    const secret = crypto.randomBytes(32).toString('hex');
    const password = crypto.randomBytes(4).toString('hex');
    const hash = crypto.createHmac('sha256', secret)
    .update(password)
    .digest('hex');
    return {
      secret: secret,
      hash: hash
    }
}


function updatePassword(password) {
    const secret = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHmac('sha256', secret)
    .update(password)
    .digest('hex');
    return {
      secret: secret,
      hash: hash
    }
}
module.exports = {generatePassword, updatePassword};