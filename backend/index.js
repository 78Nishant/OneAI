const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
require('dotenv').config();
const cors=require('cors');
const connectDB=require('./db/connection');
const mainroute=require('./routes/mainroute.js');
const { ClerkExpressRequireAuth, users } =require("@clerk/clerk-sdk-node");

app.use(cors()); 
app.use(express.json());
app.use('/main',mainroute);

app.get("/", (req, res) => {
  res.json("Welcome to the Home route");
});

app.get("/protected", require("./middleware/authMiddleware"), (req, res) => {
    res.json({ message: "You have access!", user: req.auth });
  });

app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port ${port}`);
});