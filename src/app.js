const express=require('express');
const cors=require('cors')
require("dotenv").config();
const app=express();
const authroutes=require('../src/routes/auth.routes.js')
const userroutes=require('../src/routes/user.routes.js')
const googleroutes=require('../src/routes/googleauth.routes.js')
const forgotpassword=require('../src/routes/auth.routes.js')
const resetPassword=require('../src/routes/auth.routes.js')
const gigroutes=require('./routes/gig.routes.js')
const proposal=require('./routes/proposal.routes.js')
app.use(express.json())
app.use(cors());

app.use('/api/auth',authroutes)
app.use('/api/users',userroutes)
app.use('/api/auth/google',googleroutes)
app.use('/api/auth/google/logout',require('./routes/googleauth.routes.js'))
app.use('/api/auth/forgot-password',forgotpassword)
app.use('/api/auth/reset-password/:token',resetPassword)
app.use("/api/gigs",gigroutes);
app.use('/api/proposals',proposal);


module.exports=app;