const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.status(401).json({
                msg: "No token, Authorization denied!"
            });
        }
        const verifiedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        if (!verifiedToken) {
            return res.status(401).json({
                msg: "Token verification failed!"
            });
        }
        //console.log(verifiedToken);
        req.user = verifiedToken.id;
        next();
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = auth;