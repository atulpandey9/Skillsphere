const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        
        if (!email) {
          return done(new Error("No email associated with this Google account."), null);
        }

        // 1. Look up user by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Look up user by email to link existing account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          user.isEmailVerified = true; // Email verified via Google Auth
          await user.save();
          return done(null, user);
        }

        // 3. Otherwise, create a new user profile
        // Strip spaces from displayName for a username or fallback
        const cleanName = profile.displayName
          ? profile.displayName.replace(/\s+/g, "").toLowerCase()
          : "googleuser";
        const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
        const username = `${cleanName}${uniqueSuffix}`;

        user = await User.create({
          username,
          email,
          googleId: profile.id,
          isEmailVerified: true,
          role: "freelancer", // Default role as specified in Usermodel
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user out of the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password -twoFactorSecret");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
