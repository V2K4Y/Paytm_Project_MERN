const { userModel, accountModel } = require("../models/user");
const { setUser } = require("../services/token");
const { signupSchema, signinSchema } = require("../type");

const signup = async (req, res) => {

    const {success} = signupSchema.safeParse(req.body);
    if(!success) return res.status(401).json({msg: "Invalid inputs!"});

    const {username, password, firstName, lastName} = req.body;
    try {
        const findUser = await userModel.findOne({username});
        if(findUser) return res.status(303).json({msg: "User already exists!"});
        const user = await userModel.create({username, password, firstName, lastName});
        const balance = Math.floor((Math.random()*10000 + 1) * 100);
        await accountModel.create({userId:user._id, balance})
        if(user) {
            setUser(res, user._id);
            return res.status(200).json({id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName});
        }
        else {
            return res.status(400).json({msg: "Something went wrong!"});
        }
    } catch (error) {
        console.log('Internal Servor Error: ', error);
        return res.status(500).json({msg: 'Internal server error!'});
    }
}

const signin = async (req, res) => {

    const {success} = signinSchema.safeParse(req.body);
    if(!success) return res.status(401).json({msg: "Invalid inputs!"});

    const {username, password} = req.body;
    try {
        const user = await userModel.findOne({username});
        if(user && user.matchPassword(password)) {
            setUser(res, user._id);
            return res.status(200).json({id: user._id, username: user.username, firstName: user.firstName, lastName: user.lastName});
        } else {
            return res.status(303).json({msg: "Incorrect username or password !"});
        }
    } catch (error) {
        
    }
}

const userUpdate = async (req, res) => {
    const id1 = req.query.find || false
    if(id1) {
        const user = await userModel.findById(id1);
        return res.status(200).json({msg: "Fetched", user});
    }
    if(!req.body.firstName && !req.body.lastName && ! req.body.password) return res.status(401).json({msg: "Bad request!"});
    if(req.body.password && req.body.password.length < 6) return res.status(411).json({msg: "Error while updating!"});
    const id = req.userId;
    try {
        const user = userModel.findByIdAndUpdate({id}, {...req.body});
        if(user) return res.status(200).json({msg: 'Updated Successfully!'});
    } catch (error) {
        console.log("Internal server error! ", error);
        return res.satus(500).json({msg: "Internal server error!"});
    }

}

const getUsers = async (req, res) => {

    const filter = req.query?.filter || "";
    const user = await userModel.find({
        $or: [{firstName: {
                "$regex": filter.trim().toLowerCase()
                } 
            },
            {lastName: {
                "$regex": filter.trim().toLowerCase()
                }
            }]
    });
    if(user.length) return res.status(200).json({msg: "Found!", user});
    else return res.status(404).json({msg: "Not found!"});
}
module.exports = { signup, signin, userUpdate, getUsers }