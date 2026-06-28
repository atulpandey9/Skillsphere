const mongoose=require('mongoose')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const usermodel=require('../models/user.model.js');

async function registeruserController(req,res) {
    const{username,email,password,role}=req.body;

    if(!username||!password||!email){
        return res.status(400).json({
            message:"plese provide username,email and password"
        })
    }

const useralreadyexisted=await usermodel.findOne({
    $or:[
        {username},{email}]
})

if(useralreadyexisted){
     return res.status(400).json({
            message: "Account already exists with this email address or username"
})}

const hash=await bcrypt.hash(password,10);

const user=await usermodel.create({
    username,
    email,
    password:hash
})

const token=jwt.sign({
    id:user._id,
    username:user.username,
    role:user.role
},
process.env.JWT_SECRET,
        { expiresIn: "1d" }
)

res.cookie("token",token);

res.status(201).json({
    message:"user created successfully",
      user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
})
}



async function loginuserController(req,res) {
    const {email,password}=req.body;

    const user=await usermodel.findOne({email});

      if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid=await bcrypt.compare(password,user.password)


     if(!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
 const token=jwt.sign(
        {id:user._id,
        username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    
    res.status(200).json({
        message:"user loggedin successfully",
        user:{
              id:user._id,
              username:user.username,
              email:user.email
        },
        token:token
    })
}

async function logoutUserController(req,res) {
    const token=req.cookies.token

    if(token){
await tokenBlackListModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired email verification token.",
      });
    }

    // Clear verification fields and mark as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your email has been successfully verified! You now have full access.",
    });
  } catch (error) {
    console.error("Email Verification Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during email verification.",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role input
    if (!role || !["admin", "freelancer", "client"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid role ('admin', 'freelancer', or 'client').",
      });
    }
 
    // Find and update the user
    const user = await User.findById(id);
    if (!user) {
      return res.status(444).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update role
    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role successfully updated to '${role}'.`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating user role.",
    });
  }
};
module.exports={
    registeruserController,
    loginuserController,
    logoutUserController,
    verifyEmail,
    updateUserRole
}
