const path = require("path");
console.log("Resolved path to Child.js:", path.resolve(__dirname, "./models/Child"));
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

// Debugging lines
console.log('Current working directory:', process.cwd());
try {
    console.log('Resolved path:', require.resolve("./models/Child"));
} catch (error) {
    console.error('Error resolving path:', error);
}

const childRoutes = require("./routes/child"); // Ensure this path is correct
app.use('/api', childRoutes); // Prefix routes with /api

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Registration Endpoint
app.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send("User registered successfully!");
    } catch (error) {
        res.status(400).send("Error registering user: " + error.message);
    }
});

// Login Endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err.message));

// Start Server

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});