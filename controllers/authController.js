const User = require("../models/User");
// const admin = require("firebase-admin");
const fetch = require("node-fetch");
// const { OAuth2Client } = require("google-auth-library");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// const CLIENT_ID =
//   "774334622287-lnfclbt9ndpfnhab8qj50mjdj2gkisse.apps.googleusercontent.com";
// const client = new OAuth2Client(CLIENT_ID);
// const jwksClient = require("jwks-rsa");
const { sendEmail } = require("../utils/sendEmail");
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;

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
      location: location || "",
      role: role || "user",
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
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
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

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

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
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Access token is required" });
    }

    // Fetch user info from Google
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: "Invalid Google access token" });
    }

    const payload = await response.json();

    // User info
    const user = {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
    // TODO: Save user to DB or create JW
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// const appleLogin = async (req, res) => {
//   try {
//     const { identityToken } = req.body;

//     if (!identityToken) {
//       return res.status(400).json({ error: "Identity token is required" });
//     }

//     // Apple public keys
//     const client = jwksClient({
//       jwksUri: "https://appleid.apple.com/auth/keys",
//     });

//     function getKey(header, callback) {
//       client.getSigningKey(header.kid, function (err, key) {
//         const signingKey = key.getPublicKey();
//         callback(null, signingKey);
//       });
//     }

//     // Verify JWT
//     jwt.verify(identityToken, getKey, {}, (err, payload) => {
//       if (err) return res.status(401).json({ error: "Invalid Apple token" });

//       // payload me user info hoti hai
//       const user = {
//         appleId: payload.sub,
//         email: payload.email,
//         name: payload.name || null, // Apple may not provide name on subsequent logins
//       };

//       // TODO: Save user in DB or create JWT
//       return res.status(200).json({ user });
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Something went wrong" });
//   }
// };

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  ForgotPassword,
  ResetPassword,
  CheckUserByEmail,
  googleLogin,
  // appleLogin,
};
