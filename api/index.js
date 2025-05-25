const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const bcrypt = require('bcryptjs')
const app = express();
const jwt = require ('jsonwebtoken');
const cookieParser = require('cookie-parser'); 

const salt = bcrypt.genSaltSync(10);
const secret = 'abcdef';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://jpdizon:yx0AyoGkWd5YMFXc@cluster0.avmqph9.mongodb.net/');

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json('wrong credentials');
    }

    const passOK = bcrypt.compareSync(password, userDoc.password); // compare passwords

    if (passOK) {
      // logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax', // or 'none' if using HTTPS
            secure: false,   // set to true if using HTTPS
          })
          .json('ok');
      });
    } else {
      res.status(400).json('wrong credentials');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json('internal server error');
  }
});


app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => { 
  res.cookie('token', '').json('ok');
});
app.listen(4000);


/*
database username and password:
blog0
U4E54h0gUAwLhok3
w // edit ip whitelist added my IP address
*/