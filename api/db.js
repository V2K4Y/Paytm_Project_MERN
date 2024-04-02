const mongoose = require('mongoose');

const connectMongo = (URI) => {
    return mongoose.connect(URI);
}

module.exports = { connectMongo }