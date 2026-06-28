const express=require('express');
const cors=require('cors')
require("dotenv").config();
const app=express();
const authroutes=require('../src/routes/auth.routes.js')
const userroutes=require('../src/routes/user.routes.js')
const googleroutes=require('../src/routes/googleauth.routes.js')

app.use(express.json())
app.use(cors());

app.use('/api/auth',authroutes)
app.use('/api/users',userroutes)
app.use('/api/auth/google',googleroutes)

module.exports=app