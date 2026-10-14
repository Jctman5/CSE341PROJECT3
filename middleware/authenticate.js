const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json({ error: "You do not have access. Please log in." });
    }
    next(); // ← if this is missing, the request hangs forever
};
module.exports = {
    isAuthenticated
};
    