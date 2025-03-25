const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// User Signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone, address });

    res.status(201).json({ 
      _id: user.id, name, email, phone, address, token: generateToken(user.id) 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.json({ _id: user.id, name: user.name, email, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { signupUser, loginUser };
