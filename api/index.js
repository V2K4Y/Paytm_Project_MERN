const express = require('express');
const cookieParser = require('cookie-parser');
const { connectMongo } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());

connectMongo(process.env.DB_URL).then(()=> console.log('MongoDB connected!'))

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>');
})

app.use('/api/v1/', require("./routes/index"));

app.listen(3001, () => console.log("Listening on PORT: 3001"));