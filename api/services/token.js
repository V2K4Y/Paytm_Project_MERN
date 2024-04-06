const jwt = require('jsonwebtoken');

const setUser = (res, id) => {
    const token = jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.cookie("jwtCookie", token);
}

const getUser = (jwtCookie) => {
    if(!jwtCookie) return null;
    try {
        const data = jwt.verify(jwtCookie, process.env.JWT_SECRET);
        return data.userId;
    } catch (error) {
        console.log('JWT_VERIFICATION ERROR: ', error);
        return false;
    }

}

module.exports = { setUser, getUser }