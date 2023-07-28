const jwt = require('jsonwebtoken');
const secret = "Ashish$2020#NITP";

function setUser(user){
    return jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, secret);
}

function getUser(token) {
    if(!token) return null;
    try{
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}