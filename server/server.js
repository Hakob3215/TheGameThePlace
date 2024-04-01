const express = require('express');
const path = require('path');
const cors = require('cors');
const validator = require('validator');
const bcrypt = require('bcrypt');
const http = require('http');
const socketIo = require('socket.io');

// import the database and email modules (mongoose and nodemailer)
const db = require('./db');
const emails = require('./emails');

// create the server
const app = express();
app.use(cors());
const port = process.env.PORT || 10000;

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "https://thegametheplace.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  }
});
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// bcrypt salt rounds
const saltRounds = 10;

require('dotenv').config();

userModel = db.User;
gridModel = db.Grid;
transporter = emails.transporter;

app.use(express.json());

app.post('https://thegametheplace.onrender.com/api/signup', async (req, res) => {
    console.log('Sign Up request received');
    let usertaken = false;
    let emailtaken = false;
    await userModel.findOne({
      username: req.body.username
    }).then((user) => {
      if(user){
        usertaken = true;
      }
    }).catch((err) => {
      console.log(err);
    });
  
    await userModel.findOne({
      email: req.body.email
    }).then((email) => {
      if(email){
        emailtaken = true;
      }
    }).catch((err) => {
      console.log(err);
    });
  
    // response codes:
    // 200: user exists
    // 201: email exists
    // 202: both exist
    // 203: neither exist, create user
    // 204: invalid email
  
    if (usertaken && emailtaken) {
      res.sendStatus(202);
      return;
    }
    if (usertaken) {
      res.sendStatus(200);
      return;
    }
    if (emailtaken) {
      res.sendStatus(201);
      return;
    }
  
    // check if the email is valid
    if (!validator.isEmail(req.body.email)) {
      res.sendStatus(204);
      return;
    }
  
    // everything is fine, its time to verify the email
    res.sendStatus(203);
  });


app.post('https://thegametheplace.onrender.com/api/verification-email', (req, res) => {
    console.log('Verification Email request received');
    // send verification code to email
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    let hashedCode = null;

    // encrypt the verification code
    bcrypt.hash(verificationCode.toString(), saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log('Original Code = ' + verificationCode.toString() + ' Hash = ' + hash);
        hashedCode = hash;
      }
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Email Verification',
      text: `Your verification code is ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Email not sent: ' + error);
        res.sendStatus(501);
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ hashedCode });
      }
    });
});

app.post('https://thegametheplace.onrender.com/api/check-verification', (req, res) => {
    console.log('Check Verification request received:' + req.body.verificationCode + ' ' + req.body.storedCode);
    // compare the verification code with the stored code
    bcrypt.compare(req.body.verificationCode, req.body.storedCode, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        if (result) {
        // success
        // create a new user
        const newUser = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });
        newUser.save().then(() => {
            console.log('User created');
        }).catch((err) => {
            console.log(err);
        });
        res.sendStatus(200);
        } else {
        // incorrect
          res.sendStatus(201);
        }
      }
    });
});
  
app.post('https://thegametheplace.onrender.com/api/signin', (req, res) => {
    console.log('Sign In request received');
    userModel.findOne({
      username: req.body.username
    }).then((user) => {
      if(user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            if (result) {
              res.sendStatus(200);
            } else {
              res.sendStatus(201);
            }
          }
        });
      }
      else {
        res.sendStatus(201);
      }
    }
    ).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.post('https://thegametheplace.onrender.com/api/update-grid', (req, res) => {
    console.log('Update Grid request received');
    // update the grid
    gridModel.findOneAndUpdate({}, {
      $set: {
        [`grid.${req.body.i}.${req.body.j}`]: req.body.color
      }
    }).then(() => {
      res.sendStatus(200);
      io.emit('update-grid', req.body);
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get('https://thegametheplace.onrender.com/api/get-grid', (req, res) => {
    console.log('Get Grid request received');
    gridModel.findOne().then((grid) => {
      res.status(200).json(grid.grid);
    }).catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get('/', (req, res) => {
  res.send('Server is running');
});


server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});