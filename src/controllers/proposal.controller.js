const proposalmodel=require("../models/proposal.model");
const mongoose=require('mongoose')
const gigmodel=require('../models/gig.model')

async function createproposal(req,res){
    try{
const {coverLetter,bidAmount,deliveryTime}=req.body;
const {gigId}=req.params;
const gig = await gigmodel.findById(gigId);
if(!gig){
    return res.status(404).json({
        success:false,
        message:"gig not found"
    })
}

if (gig.createdBy.toString() === req.user.id) {
  return res.status(400).json({
      success: false,
      message: "You cannot apply to your own gig.",
       });
        }

if(!coverLetter||!bidAmount||!deliveryTime){
    return res.status(400).json({message:"enter full details"});
}
const existingProposal = await proposalmodel.findOne({
    gig: gigId,
    freelancer: req.user._id
});

if(existingProposal){
    return res.status(400).json({
        success:false,
        message:"Already applied."
    });
}
const proposal=await proposalmodel.create({
 gig: gigId,
    freelancer: req.user._id,
    coverLetter,
    bidAmount,
    deliveryTime,
})
return res.status(201).json({
    message:"proposal created"
})

    }catch(err){
        console.error("Create Gig Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}



async function getproposals(req,res){
    try {
        const proposals = await proposalmodel.find({ freelancer:req.user._id }).populate("gig", "title category budget status").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: proposals.length,
            proposals,
        });

    } catch (err) {
        console.error("Get My Proposals Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

async function getgigproposals(req,res){
try {
        const { gigId } = req.params;
        const gig = await gigmodel.findById(gigId);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found",
            });
        }

        if (!gig.createdBy.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view these proposals.",
            });
        }
        const proposals = await proposalmodel
            .find({ gig: gigId })
            .populate("freelancer", "username email")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: proposals.length,
            proposals,
        });

    } catch (err) {
        console.error("Get Gig Proposals Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function acceptproposal(req,res){
   try {
        const { proposalId } = req.params;
        const proposal = await proposalmodel.findById(proposalId);
        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found.",
            });
        }
        const gig = await gigmodel.findById(proposal.gig);
        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found.",
            });
        }

        if (!gig.createdBy.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this proposal.",
            });
        }
        if (proposal.status === "Accepted") {
            return res.status(400).json({
                success: false,
                message: "Proposal is already accepted.",
            });
        }
        proposal.status = "Accepted";
        await proposal.save();


        await proposalmodel.updateMany(
            {
                gig: proposal.gig,
                _id: { $ne: proposal._id },
            },
            {
                status: "Rejected",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Proposal accepted successfully.",
            proposal,
        });

    } catch (err) {
        console.error("Accept Proposal Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}


async function rejectproposal(req,res){

    try{
const {proposalId}=req.params;
    const proposal = await proposalmodel.findById(proposalId);

    if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found.",
            });
        }

        proposal.status="Rejected";
         await proposal.save();

return res.status(200).json({
    success:true,
    message:"proposal rejected successfully"
})

    }
    catch(error){
        console.log("rejectproposal error:",error);
        
return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
    
}


async function withdrawproposal(req,res) {
    try{
const{proposalId}=req.params;
const proposal = await proposalmodel.findById(proposalId);

    if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found.",
            });
        }
       if (!proposal.freelancer.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to withdraw this proposal.",
            });
        }

        if (proposal.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending proposals can be withdrawn.",
            });
        }

         await proposalmodel.findByIdAndDelete(proposalId);

        return res.status(200).json({
            success: true,
            message: "Proposal withdrawn successfully.",
        });
    }catch(error){
console.error("Withdraw Proposal Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

module.exports={createproposal,getproposals,getgigproposals,acceptproposal,rejectproposal,withdrawproposal}