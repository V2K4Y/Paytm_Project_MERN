const { default: mongoose, mongo } = require("mongoose");
const { accountModel } = require("../models/user");

const getBalance = async (req, res) => {
    const userId = req.userId;
    try {
        const account = await accountModel.findOne({ userId });
        return res.status(200).json({msg: "Succesfully fetched !", balance: (account.balance)/100});
    } catch (error) {
        console.log("Internal SERVER error !");
        return res.status(200).json({msg: "Internal server erro !", error});
    }
}

const transfer = async (req, res) => {

    try {

        //initializing the session
        const session = await mongoose.startSession();

        //starting the transaction session
        session.startTransaction();
    
        const from = req.userId;
        const { to, amount} = req.body;
    
        // fetching account within transaction
        const account = await accountModel.findOne({userId: from}).session(session);
        
        //checking the neccessary conditions
        if(!account || account.balance < (amount * 100)) {
            await session.abortTransaction();
            return res.status(400).json({
                msg: "Insufficient balance !"
            });
        }
    
        const toAccount = await accountModel.findOne({userId: to});
    
        if(!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({msg: 'Invalid account !'});
        }
    
        // performing the transactions
        await accountModel.updateOne({userId: from}, {$inc: {balance: -(amount * 100)}}).session(session);
        await accountModel.updateOne({userId: to}, {$inc: {balance: (amount * 100)}}).session(session);
    
        // commiting the transaction
        session.commitTransaction();
        return res.status(200).json({msg: "Transfer successful!"});

    } 
    catch (error) {

        console.log('Internal server error! : ', error);
        session.abortTransaction();
        return res.status(400).json({msg: "Something went wrong!"});

    }

}

module.exports = { getBalance, transfer };