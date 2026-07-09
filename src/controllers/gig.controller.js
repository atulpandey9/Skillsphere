const gigmodel=require('../models/gig.model');
const jwt=require('jsonwebtoken');


async function creategig(req,res) {
   try{
   const {title,description,category,skills,budget,duration,experienceLevel}=req.body;

    if(!title||!description||!category||!skills||!budget||!duration||!experienceLevel){
        return res.status(400).json({message:"plese fill up full details"})
    }
const gig=await gigmodel.create({
    title,description,category,skills,budget,duration,experienceLevel,createdBy: req.user.id
})
return res.status(201).json({
      success: true,
      message: "Gig created successfully.",
      data: gig,
    });

   }catch(err){
console.error("Create Gig Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
   }
 

}


async function getallgig(req,res){
   
const getAllGigs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, sort } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const gigs = await gigmodel.find(filter)
      .sort(sortOption)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


}



module.exports={creategig,getallgig}