const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    let token = req.headers['authorization']; //Gets token from requests header
    
    if(!token){
        return res.status(400).json({ error: "Access denied. No token provided" });
    }

    if(token.startsWith('Bearer ')){
        token = token.slice(7, token.length);
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //Add user data to request object
        next();
    } catch(err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = authMiddleware;