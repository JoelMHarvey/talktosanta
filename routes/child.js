const express = require("express");
const router = express.Router();
const Child = require("./models/Child");
const authMiddleware = require("./middleware/auth"); // Ensure parents are authenticated

// Create a new child profile
router.post("/children", authMiddleware, async (req, res) => {
    try {
        const { name, age, interests, wishes } = req.body;
        const child = new Child({ 
            parentId: req.user.id, // Assuming req.user is populated by authMiddleware
            name,
            age,
            interests,
            wishes
        });
        await child.save();
        res.status(201).json(child);
    } catch (error) {
        res.status(500).send("Error creating child profile: " + error.message);
    }
});

// Get all child profiles for the logged-in parent
router.get("/children", authMiddleware, async (req, res) => {
    try {
        const children = await Child.find({ parentId: req.user.id });
        res.json(children);
    } catch (error) {
        res.status(500).send("Error fetching child profiles: " + error.message);
    }
});

// Update a child profile
router.put("/children/:id", authMiddleware, async (req, res) => {
    try {
        const { name, age, interests, wishes } = req.body;
        const child = await Child.findOneAndUpdate(
            { _id: req.params.id, parentId: req.user.id }, // Ensure only the parent can edit
            { name, age, interests, wishes },
            { new: true }
        );
        if (!child) return res.status(404).send("Child not found");
        res.json(child);
    } catch (error) {
        res.status(500).send("Error updating child profile: " + error.message);
    }
});

// Delete a child profile
router.delete("/children/:id", authMiddleware, async (req, res) => {
    try {
        const child = await Child.findOneAndDelete({ _id: req.params.id, parentId: req.user.id });
        if (!child) return res.status(404).send("Child not found");
        res.send("Child profile deleted");
    } catch (error) {
        res.status(500).send("Error deleting child profile: " + error.message);
    }
});

module.exports = router;