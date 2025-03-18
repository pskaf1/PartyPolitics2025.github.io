require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

require("./passportConfig");
const User = require("./models/User");
const initWebSocket = require("./utils/WebSocket");
const authRoutes = require("./routes/auth");
const debateRequestRoutes = require("./routes/debateRequest");
const debateTopicsRoutes = require("./routes/debate-topics");
const googleAuthRoutes = require("./routes/googleAuth");

const LOCAL_IP = "127.0.0.1"; // Changed to loopback IP for consistency
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/debate-platform";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", `http://${LOCAL_IP}:3000`],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Attach user from session to `req.user`
app.use(async (req, res, next) => {
  if (req.session?.passport?.user) {
    try {
      const user = await User.findById(req.session.passport.user);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      console.error("❌ Error attaching session user:", err);
    }
  }
  next();
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/debate-request", debateRequestRoutes);
app.use("/api/debate-topics", debateTopicsRoutes);
app.use("/auth/google", googleAuthRoutes);

// ✅ Alias for `/api/debates` (Prevents frontend issues)
app.use("/api/debates", debateTopicsRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

// ✅ WebSocket Initialization
initWebSocket(io);

// ✅ Start Server
server.listen(PORT, LOCAL_IP, () => console.log(`✅ Server running on http://${LOCAL_IP}:${PORT}`));
