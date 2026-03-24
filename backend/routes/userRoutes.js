const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/user/register
// @desc Register a new user
// @access Public

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ name, email, password });
        await user.save();

        // Create JWT Payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            // send the user and token in response

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

// @route POST /api/users/login
// @desc authentication user
// @sccess Public

router.post("/login",  async (req,res) => {
    const {email,password} = req.body;

    try{
        let user = await User.findOne({email});

        if(!user) return res.status(400).json({message:"Invalid Credentials"});
        const isMatch = await user.matchPassword(password);

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

        // Create JWT Payload
        const payload = { user: { id: user._id, role: user.role } };

         // Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            // send the user and token in response

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});


router.post("/forgot-password", async (req, res) => {
    try {
        console.log("FORGOT PASSWORD API HIT");

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = user.getResetToken();
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        console.log("RESET URL:", resetUrl);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset",
            text: `Reset your password: ${resetUrl}`,
        });

        console.log("EMAIL SENT SUCCESS ✅");

        return res.json({ message: "Email sent" });

    } catch (error) {
        console.log("FULL ERROR ❌:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post("/reset-password/:token", async (req, res) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
});

// @route GET /api/users/profile
// @desc GET logged-in user's profile (Protected Route)
// @access Private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;