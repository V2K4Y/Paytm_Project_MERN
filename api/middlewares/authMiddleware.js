const { getUser } = require( "../services/token" );

const authMiddleware = (req, res, next) => {
    // const authHeader = req.body.autherization;
    // console.log(authHeader);
    // if(!authHeader || !authHeader.startsWith('Bearer '))
    //     return res.status(403).json({msg: "Not autherized!"});

    // const id = getUser(authHeader.split(' ')[1]);
    const token = req.cookies.jwtCookie;
    const id = getUser(token);

    if(id) {
        req.userId = id;
        next();
    } else {
        return res.status(403).json({msg: "Not autherized!"});
    }
}

module.exports = { authMiddleware };