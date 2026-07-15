const express=require('express');
const router=express.Router();
const {createproposal,getproposals,getgigproposals,acceptproposal,rejectproposal,withdrawproposal}=require('../controllers/proposal.controller');
const { requireAuth, requireRole} = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');




router.post("/:gigId",requireAuth,upload.array("documents",5),createproposal)
router.get("/myproposals",requireAuth,requireRole("freelancer"),getproposals)
router.get("/getgigproposals/gig/:gigId",requireAuth,requireRole("freelancer"),getgigproposals)
router.patch("/:proposalId/accept",requireAuth,acceptproposal)
router.patch("/:proposalId/reject",requireAuth,rejectproposal)
router.delete("/:proposalId",requireAuth,requireRole("freelancer"),withdrawproposal)
module.exports=router;