import { errorHandler } from "../utils/error.js";
import User from "../models/User.js";


const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ result: allUsers });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...profileData } = user._doc;
    res.status(200).json({ result: profileData });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, email, income, phoneNumber, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(errorHandler(400, "Email already in use"));
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (income !== undefined) user.income = income;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;

    await user.save();
    const { password, ...profileData } = user._doc;

    res.status(200).json({ 
      message: "Profile updated successfully", 
      result: profileData 
    });
  } catch (error) {
    next(error);
  }
};



export {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
};