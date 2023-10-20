const checkToken = async (req, res, next) => {
    if (!req.session.token) return res.status(401).json({ message: 'bạn chưa đăng nhập' });
    next();
}

module.exports = {
    checkToken,
}