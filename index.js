require('dotenv').config();
const express=require("express");
// const bodyParser= require('body-parser') ;
var cors = require('cors')
const mongoose=require("mongoose");
const User=require("./modules/users");
// const cookieParser = require('cookie-parser');
const session=require('express-session');
const MongoStore=require("connect-mongo");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const listRoute=require('./routers/listroute');
const reviewRoute=require('./routers/reviewroute');
const userRoute=require('./routers/userroute');



const main =async()=>{await mongoose.connect(process.env.database_Url);}
  main()
  .then(() => console.log('Connected!'))
  .catch((err)=>{
    console.log(err)
  });

const app=express();
// app.use(cookieParser('secretcode'))
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: process.env.front_Url, 
  credentials: true, 
}));

const store=MongoStore.create({
  mongoUrl:process.env.database_Url,
  crypto:{
    secret:process.env.secret
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("mongo session error",err)
})
app.use(session({
  store,
  secret:process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: new Date(Date.now() + (30 * 24 * 3600 * 1000)),
    // maxAge:7*24*3600*1000,
    httpOnly:true,
    secure: process.env.NODE_ENV === "production", 
  }
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/',userRoute)
app.use('/list',listRoute)
app.use('/list/:id/review',reviewRoute)


app.all("*",(req,res)=>{
  res.status(404).send("page not found.")
})
app.use((err,req,res,next)=>{
  const {status=500,message="something went wrong."}=err;
  res.status(status).json(message);
})
app.listen(3000,()=>{
    console.log("server listening..");
})
