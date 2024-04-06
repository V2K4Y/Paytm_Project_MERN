const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 50,
    }
}, {timestamps: true})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) 
        next;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function (givenPassword) {
    return await bcrypt.compare( givenPassword, this.password );
}

const userModel = mongoose.model('Paytm_user', userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paytm_user',
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    }
})

const accountModel = mongoose.model('paytm_account', accountSchema);

module.exports = { userModel, accountModel };