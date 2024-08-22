module.exports = function(role) {
    return function(req, res, next) {
        try {
            if (req.user.role !== role) {
                return res.status(403).json({ message: 'No access' });
            }
            next();
        } catch (e) {
            res.status(403).json({ message: 'No access' });
        }
    };
}