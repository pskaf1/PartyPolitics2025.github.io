const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",  // Ensures email exists
            firstName: profile.name?.givenName || "Unknown",
            lastName: profile.name?.familyName || "User",
          });
        }

        req.session.user = user;
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("✅ Serializing user:", user._id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("🔵 Deserializing user ID:", id);
    const user = await User.findById(id);
    if (user) {
      console.log("✅ User deserialized successfully:", user);
      done(null, user);
    } else {
      console.error("❌ User not found in database during deserialization.");
      done(null, false);
    }
  } catch (err) {
    console.error("❌ Error deserializing user:", err);
    done(err, null);
  }
});




