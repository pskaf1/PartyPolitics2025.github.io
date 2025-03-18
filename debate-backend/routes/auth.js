const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { sendEmail, generateTemplate } = require("../utils/sendEmail");
const { validateSignup, validateLogin } = require("../utils/validators");

const router = express.Router();

// ✅ Secrets & Configs
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_key_here";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ✅ Token Functions
const generateAccessToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (userId) => jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

// ✅ Login Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please try again later." },
});

// ✅ Get Current User
router.get("/current-user", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized", message: "No user logged in." });
  }
  res.status(200).json(req.user);
});

// ✅ Signup Route
router.post("/signup", validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password, firstName, lastName, consentForPublic, googleId } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "Conflict", message: "Email already registered." });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      googleId: googleId || null,
      consentForPublic,
      verificationToken,
      isVerified: googleId ? true : false, // Auto-verify if signing up with Google
    });

    await newUser.save();

    // ✅ If not using Google, send verification email
    if (!googleId) {
      const verificationUrl = `${CLIENT_URL}/verify-email/${verificationToken}`;
      const emailHtml = generateTemplate("signupConfirmation", { firstName, verificationUrl });

      await sendEmail(email, "Verify Your Email", "", emailHtml);
      return res.status(201).json({ message: "User created! Verify your email." });
    }

    // ✅ If using Google, log the user in automatically
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    res.status(201).json({
      message: "User created and logged in successfully!",
      accessToken,
      refreshToken,
      user: newUser,
    });

  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });  
  }
});

// ✅ Email Verification - Auto Login After Verification
// ✅ Email Verification & Auto-login
router.get("/verify-email/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ error: "Bad Request", message: "Invalid or expired verification token." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Generate login tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // ✅ Send tokens back immediately for auto-login
    res.status(200).json({
      message: "Email verified successfully!",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: "Error verifying email." });
  }
});


// ✅ Login Route
router.post("/login", loginLimiter, validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Unauthorized", message: "User not found." });
    }

    // ✅ Ensure email is verified before allowing login
    if (!user.isVerified) {
      return res.status(403).json({ error: "Forbidden", message: "Email not verified. Please verify your account." });
    }

    // ✅ Check password only if user is NOT using Google login
    if (!user.googleId && !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Unauthorized", message: "Invalid credentials." });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user,
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: "Error logging in." });
  }
});

module.exports = router;
