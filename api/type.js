const zod = require('zod');

const signupSchema = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
})

const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
})

module.exports = { signupSchema, signinSchema }