const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded || !decoded.isActivated) {
            return res.status(403).json({message: 'User account is not activated'});
        }

        req.user = decoded;
        next();
    } catch (e) {
        logger.error(e);
        res.status(401).json({message: 'Unauthorized'});
    }
}