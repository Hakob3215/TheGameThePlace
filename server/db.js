const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;

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
    password: String,
    // number of pixels placed by user
    // pixelCount: Number
});

// handle password hashing
userSchema.pre('save', async function(next) {
    // modify the password before saving it to the database
    // this refers to the user object
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

// Create a schema for grid, a 2D array of color strings
const gridSchema = new mongoose.Schema({
    grid: {
        type: [[String]],
        default: Array(75).fill().map(() => Array(160).fill('white'))
    }
})

// create a model for the grid
const Grid = mongoose.model('Grid', gridSchema);

// create a model for users
const User = mongoose.model('User', userSchema);

// export models for use in server.js
module.exports = {User, Grid};