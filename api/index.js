require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors')
const mongoose = require('mongoose');
const User=require('./models/User.js')
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser')
const Place = require('./models/Place')
const imageDownloader= require('image-downloader')


const jwtSecret='fasefraw4r5r3wq45wdfgw34twdfg';
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));  


app.use(cors({
    credentials:true,   
    origin:'http://127.0.0.1:5173'
}))

try{
    console.log("Hello")
    // mongodb connection string
    const con = mongoose.connect("mongodb+srv://burhankader5252:PAp8f8aXG7dqI2g7@cluster0.rlh5mdh.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log(`MongoDB connected : ${con}`);
}catch(err){
    console.log(err);
}


app.get('/test',(req,res)=>{
    res.json('Test is OKAY');
})
// PAp8f8aXG7dqI2g7
app.post('/register',async (req,res)=>{
    const {name,email,password}=req.body;
    // res.json({name,email,password});
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDoc= await User.create({
            name,
            email,
            password:hashedPassword
        })
        res.json(userDoc);
    }catch(err){
        console.log("ERRORIS: ",err);
        res.status(500).json({error:'An error occured'})
    }
    
})

app.post('/login',async (req,res)=>{
    console.log("Inside login")
    const{email,password}=req.body;
    // res.json({email,password});
    try{
        const userDoc=await User.findOne({email});
        if(userDoc){
            try{
                console.log(userDoc.password)
                const isMatch=await bcrypt.compare(password,userDoc.password)
                if(isMatch){
                    jwt.sign({
                        email:userDoc.email, 
                        id:userDoc._id,
                        name:userDoc.name
                    }, jwtSecret, {}, (err,token)=>{
                        if(err) throw err;
                        res.cookie('token',token).json(userDoc)
                    })
                }else{
                    res.status(422).json("pass not accepted")
                }
            }catch(e){
                console.log(e); 
                res.status(500).json({error:"an error occured in bcrypt"});
            }   
        }else{
            res.status(400).json("User Not Found")
        }
    }catch(e){
        console.log(e);
        res.status(500).json({error:"an error occured"});
    }
})

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    console.log(token)
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
      });
    } else {
      res.json(null);
    }
});

app.post('/logout',(req,res)=>{
    console.log("Logout ke andar")
    res.cookie('token','').json(true);
})

app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body;
    const newName= 'photo'+Date.now() + '.jpg';
    console.log(__dirname)
    try{
        await imageDownloader.image({
            url:link,
            dest: __dirname+'/uploads/'+newName
        })
    }catch(e){
        console.log("upload error: "+e)
    }

    res.json(newName);

})



app.listen(3000,()=>{
    console.log("server is listening on port 3000");
})