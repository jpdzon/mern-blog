const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs')
const app = express();
const jwt = require ('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const multer = require('multer'); 
const uploadMiddlware = multer({ dest: 'uploads/' })
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'abcdef';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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
    const {username, password} = req.body;

        const userDoc = await User.findOne({username});
        const passOK = bcrypt.compareSync (password, userDoc.password); //compare password entered from password in the database
        if(passOK){
            //logged in
            jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) =>{
                if (err) throw err;
                res.cookie('token', token).json({
                    id:userDoc._id,
                    username,

                });
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

app.post('/post',uploadMiddlware.single('file') , async(req,res) => { 
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);
  
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async(err,info) => {
    if (err) throw err;
     const {title, summary, content} = req.body;

    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
   })
      res.json({postDoc});
  });

});

app.get('/post', async (req,res) => { 
  res.json(await Post.find().populate('author',['username'])
    .sort({createdAt: -1})
    .limit(20)
);
});

app.get('/post/:id', async (req,res) => { 
    const{id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
})

app.listen(4000);

 
/*
database username and password:
blog0
U4E54h0gUAwLhok3
w // edit ip whitelist added my IP address
*/