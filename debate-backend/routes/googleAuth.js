const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const router = express.Router();

// Start Google authentication
router.get("/", passport.authenticate("google", { scope: ["profile", "email"], session: true }));

// Google Auth Callback Route
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  async (req, res, next) => {
    try {
      console.log("✅ Google login successful, user:", req.user);

      if (!req.user) {
        console.error("❌ No user found after Google authentication");
        return res.redirect(`${process.env.CLIENT_URL}/login`);
      }

      // Debugging: Ensure session is properly stored
      console.log("🔵 Session Data after login:", req.session);

      // Use req.login() to properly store user session
      req.login(req.user, (err) => {
        if (err) {
          console.error("❌ Error during session save:", err);
          return next(err); // Ensure no duplicate redirects
        }

        console.log("✅ User successfully logged in and session stored.");
        return res.redirect(`${process.env.CLIENT_URL}/auth-success`);
      });

    } catch (error) {
      console.error("❌ Google login error:", error);
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }
);

// Return current authenticated user
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  async (req, res, next) => {
    try {
      console.log("✅ Google login successful, user:", req.user);

      if (!req.user) {
        console.error("❌ No user found after Google authentication");
        return res.redirect(`${process.env.CLIENT_URL}/login`);
      }

      // ✅ Store user manually in the session
      req.session.user = req.user;

      req.login(req.user, (err) => {
        if (err) {
          console.error("❌ Error during session save:", err);
          return next(err);
        }

        console.log("✅ User successfully logged in and session stored.");
        return res.redirect(`${process.env.CLIENT_URL}/auth-success`);
      });
    } catch (error) {
      console.error("❌ Google login error:", error);
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }
  }
);


// Logout Route
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error destroying session:", err);
        return next(err);
      }
      console.log("✅ User successfully logged out.");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

module.exports = router;
