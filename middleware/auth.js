const { getUser } = require('../service/auth')

function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;

    if (!tokenCookie) return next();
    
    const token = tokenCookie;
    const user = getUser(token);

    if(user){
        req.user = user;
        res.locals.user = user;
    }
    return next();
}

function restrictToWhom(roles=[]) {
    return function(req, res, next) {
        if (!req.user) return res.redirect('/login');

        
        if (!roles.includes(req.user.role)) return res.end('You are not authorized to access this resource');

        return next();
    };
}

module.exports = {
    restrictToWhom,
    checkForAuthentication
}