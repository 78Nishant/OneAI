const express = require("express");
const User = require("../model/auth.model.js");
// const authenticateUser = require("../middleware/authMiddleware.js");
const { ClerkExpressRequireAuth } =require( "@clerk/clerk-sdk-node");

const router = express.Router();

router.post("/save-user", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { id, email_address, full_name } = req.body; // Clerk stores data in req.auth

    if (!id) {
      return res.status(401).json({ error: "Unauthorized: No user ID found" });
    }

    let user = await User.findOne({ clerkId: id });

    if (!user) {
      user = new User({
        clerkId: id,
        email: email_address, // Avoids undefined error
        fullName: full_name || "Unknown User",
      });

      await user.save();  
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/', (req, res) => {
  res.json('Welcome to the main route ');
});
module.exports = router;
