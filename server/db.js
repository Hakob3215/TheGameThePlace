const mongoose = require('mongoose');
require('dotenv').config();

// connect to mongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});


// Create a schema for users [name, email, username, password]
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String
});

// Create a model for users
const User = mongoose.model('User', userSchema);


// export models for use in server.js
module.exports = {User};