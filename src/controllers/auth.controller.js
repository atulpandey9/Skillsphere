const mongoose=require('mongoose')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const usermodel=require('../models/user.model.js');
const crypto=require('node:crypto')
const { sendVerificationEmail,sendPasswordResetEmail,sendEmail} =require('../services/email.service.js')

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

const getMe = async (req, res) => {
  try {
    // req.user was populated by 'protect' middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user profile.",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await usermodel.findOne({
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
    const user = await usermodel.findById(id);
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email address.",
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      // For security, do not explicitly state if email is unregistered.
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, we have sent a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000; // 1 Hour expiration

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send email using Nodemailer helper
    try {
      await sendPasswordResetEmail(user.email, user.username, resetToken);
    } catch (emailErr) {
      console.error("📧 Password Reset Email Failed to Send:", emailErr.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send password reset email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset link successfully sent to your email inbox.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during forgot password processing.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password.",
      });
    }

    const user = await usermodel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user properties
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your password has been successfully reset! You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error resetting your password.",
    });
  }
};

module.exports={
    registeruserController,
    loginuserController,
    logoutUserController,
    verifyEmail,
    updateUserRole,
    getMe,
    forgotPassword,
    resetPassword
}
