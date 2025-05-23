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

mongoose.connect('mongodb+srv://jpdizon:vU4E54h0gUAwLhok3@cluster0.zvlga5w.mongodb.net/');

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
    const {username, password} = req.body;

        const userDoc = await User.findOne({username});
        const passOK = bcrypt.compareSync (password, userDoc.password); //compare password entered from password in the database
        if(passOK){
            //logged in
            jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) =>{
                if (err) throw err;
                res.cookie('token', token).json('ok');
            });
        }
        else{
            res.status(400).json ('wrong credentials');
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
mongodb+srv://blog0:U4E54h0gUAwLhok3@blog0.clupmno.mongodb.net/ // edit ip whitelist added my IP address
*/