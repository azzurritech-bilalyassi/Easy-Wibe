const User = require("../models/User");
// const admin = require("firebase-admin");
const fetch = require("node-fetch");
// const { OAuth2Client } = require("google-auth-library");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");

const { sendEmail } = require("../utils/sendEmail");
const downloadImage = require("../utils/downloadImage");
const { default: axios } = require("axios");
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, location, deviceToken, role } = req.body;

    const userRole = role && role === "admin" ? "admin" : "user";

    if (userRole === "user" && (!location || location.trim() === "")) {
      return res.status(400).json({ message: "Location is required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      deviceToken,
      location: location || "",
      role: role || "user",
      provider: "local",
    });

    if (user) {
      const token = generateToken(user);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
          role: user.role,
        },
        token,
      });
    } else {
      return res.status(500).json({ message: "Failed to create user" });
    }
  } catch (err) {
    console.error("RegisterUser Error:", err);
    if (err.name === "ValidationError") {
      res.status(400).json({ message: "Validation error: " + err.message });
    } else {
      res.status(500).json({ message: "Server error: " + err.message });
    }
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password, deviceToken } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (deviceToken) {
        user.deviceToken = deviceToken;
        await user.save();
      }

      const token = generateToken(user);
      res.status(201).json({
        user,
        token,
        message: "Login successfully",
      });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const LogoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// 📧 FORGOT PASSWORD
const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html: `Click here to reset your password: ${resetUrl}`,
  });

  res.json({
    message: "Password reset link sent to your email",
  });
};

// 🔄 RESET PASSWORD
const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;

    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const CheckUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select("-password");

    if (user) {
      return res.status(200).json({
        status: true,
        message: "User exists",
        user,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "User does not exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token, deviceToken } = req.body;

    if (!token) {
      return res.status(400).json({ error: "id_token is required" });
    }

    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );

    const payload = await response.json();

    if (!response.ok) {
      return res.status(401).json({
        error: "Invalid Google token",
        details: payload,
      });
    }

    const { sub, name, email, picture } = payload;

    // 📥 Download Google profile image
    const savedImagePath = await downloadImage(picture);

    let user = await User.findOne({ email });


    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
      }

      if (!user.profileImage) {
        user.profileImage = savedImagePath;
      }

      if (deviceToken) {
        user.deviceToken = deviceToken;
      }

      await user.save();
    } else {
      user = await User.create({
        googleId: sub,
        name,
        email,
        deviceToken,
        profileImage: savedImagePath,
        password: Math.random().toString(36).slice(-8),
        provider: "google",
      });
    }

    const jwtToken = generateToken(user);

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Google Login Error:", err);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const appleLogin = async (req, res) => {
  try {
    const { token, deviceToken } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Apple token is required",
      });
    }

    // Apple public keys fetch karo
    const appleKeys = await axios.get("https://appleid.apple.com/auth/keys");

    // Decode header to find correct key
    const decodedHeader = jwt.decode(token, { complete: true });
    if (!decodedHeader) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    const key = appleKeys.data.keys.find(
      (k) => k.kid === decodedHeader.header.kid,
    );
    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Apple token" });
    }

    // JWK to PEM
    const publicKey = jwkToPem(key);

    // Verify token
    const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    const { sub, email, name } = payload;

    // User find by appleId
    let user = await User.findOne({ appleId: sub });


    // Agar user exist nahi karta to create karo
    if (user) {
      if (deviceToken) {
        user.deviceToken = deviceToken;
        await user.save();
      }
    } else {
      user = await User.create({
        appleId: sub,
        email: email || "",
        deviceToken,
        name: name || email.split("@")[0],
        password: Math.random().toString(36).slice(-8),
        provider: "apple",
      });
    }

    // JWT generate karo
    const jwtToken = generateToken(user);

    res.json({
      success: true,
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("Apple Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Apple login failed",
    });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPassword,
  ResetPassword,
  CheckUserByEmail,
  googleLogin,
  appleLogin,
};
