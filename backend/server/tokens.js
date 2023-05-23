const jwt = require('jsonwebtoken');
require('dotenv').config();

//----Handle tokens
function generateAccessToken(user) {
    const access = jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn: "30m"});
    return access;
}
function generateRefreshToken(user) {
    const refresh = jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn: "30d"});
    return refresh;
}

function verifyAccessToken(token) {
    try {
        const verify = jwt.verify(token, process.env.ACCESS_TOKEN, (err, authData) => {
            if(err) return false;
            return authData;   
        });
        return verify;
    } catch(err) { 
        return false;
    }    
}
function verifyRefreshToken(token) {
    try {
        const verify = jwt.verify(token, process.env.REFRESH_TOKEN, (err, authData) => {
            if(err) return false;
            return authData;   
        });
        return verify;
    } catch(err) { 
        return false;
    }    
}

module.exports = {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken};