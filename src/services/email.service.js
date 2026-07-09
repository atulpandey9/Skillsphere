require("dotenv").config();
const nodemailer = require("nodemailer");
const getTransporter = () => {
  const isSmtpConfigured =
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_HOST;

  if (isSmtpConfigured) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
    console.warn(
    "⚠️ SMTP environment variables are not fully configured. Falling back to stdout console logger for emails."
  );
  return {
    sendMail: async (mailOptions) => {
      console.log("\n==================================================");
      console.log(`📧 [MOCK EMAIL SENT] to: ${mailOptions.to}`);
      console.log(`📝 Subject: ${mailOptions.subject}`);
      console.log("--------------------------------------------------");
      if (mailOptions.text) console.log(`Body (Text):\n${mailOptions.text}`);
      console.log("==================================================\n");
      return { messageId: "mock-message-id-" + Date.now() };
    },
  };
}


const sendEmail = async (options) => {
  const transporter = getTransporter();

  const mailOptions = {
  from: process.env.EMAIL_FROM || '"Skillsphere App" <noreply@skillsphere.com>',
    to: options.to,
    subject: 'testing email verification',
    text: 'nodemailer test',
    html:options.to 
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};


const sendVerificationEmail = async (email, username, token) => {
  const appUrl = process.env.APP_URL || "http://localhost:5000";
  const verificationUrl = `${appUrl}/api/auth/verify-email/${token}`;

   return sendEmail({
    to: email,
    subject: "Please Verify Your Skillsphere Account",
    text: `Hello ${username},\n\nPlease verify your email address by visiting this link: ${verificationUrl}\n\nThis link is valid for 24 hours.`,
    html:"<b>Email verification</b>",
  });
};


const sendPasswordResetEmail = async (email, username, token) => {
  const appUrl = "http://localhost:5000";
  const resetUrl = `${appUrl}/api/auth/reset-password/${token}`;
  return sendEmail({
    to: email,
    subject: "Reset Your Skillsphere Password",
    text: `Hello ${username},\n\nYou requested a password reset. Please click this link to set a new password: ${resetUrl}\n\nThis link is valid for 1 hour.`,
    html:"<b>password reset request</b>",
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};