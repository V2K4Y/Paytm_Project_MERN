const userModel = require("../models/userModel");
const { setUser } = require("../services/token");
const { signupSchema, signinSchema } = require("../type");

const signup = async () => {

    const {success} = signupSchema.safeParse(req.body);
    if(!success) return res.status(401).json({msg: "Invalid inputs!"});

    const {username, password, firstName, lastName} = req.body;
    try {
        const findUser = await userModel.findOne({username});
        if(findUser) return res.status(303).json({msg: "User already exists!"});
        const user = await userModel.create({username, password, firstName, lastName});
        if(user) {
            setUser(res, user._id);
            return res.status(200).json({userId: user._id});
        }
        else {
            return res.status(400).json({msg: "Something went wrong!"});
        }
    } catch (error) {
        console.log('Internal Servor Error: ', error);
        return res.status(500).json({msg: 'Internal server error!'});
    }
}

const signin = async () => {

    const {success} = signinSchema.safeParse(req.body);
    if(!success) return res.status(401).json({msg: "Invalid inputs!"});

    const {username, password} = req.body;
    try {
        const user = await userModel.findOne({username});
        if(user && user.matchPassword(password)) {
            setUser(res, user._id);
            return res.status(200).json({msg: "LoggedIn !"});
        } else {
            return res.status(200).json({msg: "Incorrect username or password !"});
        }
    } catch (error) {
        
    }
}

module.exports = { signup, signin }