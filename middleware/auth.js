// middleware/auth.js

module.exports = {
    isAdmin(req, res, next) {
        if (req.user && req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    },

    isUserOrAdmin(req, res, next) {
        if (req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.userId)) {
            return next();
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    }

};
