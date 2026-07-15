const express=require('express');
const dotenv=require('dotenv');
const app=require('./src/app.js')
const connectdb=require('./src/config/db.js')
dotenv.config()

connectdb()
require("dotenv").config();
app.get('/',(req,res)=>{
    res.send('server is running')
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`app is running on port ${PORT}`);
    
})

