const express=require('express');
const router=express.Router();
const {creategig,getallgig,updateGig,deleteGig}=require('../controllers/gig.controller.js');
const { requireAuth, requireRole, isVerified } = require("../middleware/auth.middleware.js");
const upload = require('../middleware/upload.middleware.js');

router.post("/creategig",requireAuth,upload.array("documents",5),creategig);
router.post('/getallgig',getallgig);
router.post("/updategig",updateGig)
router.post("/deletegig",deleteGig)
module.exports=router