const express=require('express');
const router=express.Router();
const {creategig,getallgig}=require('../controllers/gig.controller.js');
const { requireAuth, requireRole, isVerified } = require("../middleware/auth.middleware.js");

router.post("/creategig",requireAuth,creategig);
router.post('/getallgig',getallgig);
module.exports=router