const mongoose=require('mongoose');

const gigschema=new mongoose.Schema({
     title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    skills:[
        {
            type:String
        }
    ],

    budget:{
        type:Number,
        required:true
    },
     documents: [
        {
            fileName: String,
            fileUrl: String,
            publicId: String,
        }
    ],
    duration:{
        type:String
    },

    experienceLevel:{
        type:String,  
        required: true,
        enum:["Beginner","Intermediate","Expert"]
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    status:{
        type:String,
        enum:["Open","Closed"],
        default:"Open"
    }
},{timestamps:true});

const gigmodel=mongoose.model("gig",gigschema);

module.exports=gigmodel