import { createToken } from "../middleware/verifyUser.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/User.js";
// import Feedback from "../model/Feedback.js";

const login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All fields are requird"));
  }
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return next(errorHandler(404, "user not found!"));
    }
    const validUser = await user.comparePassword(password);
    if (!validUser) {
      return next(errorHandler(400, "Invalid credential"));
    }

    const token = createToken(user);
    const { password: pass, ...data } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ message: `Hello ${user.username}`, result: data });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User have been signed out");
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username: uname, password: pass, email: email } = req.body;
    const existingUser = await User.findOne({
      $or: [{ username: uname }, { email }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Oops! Username taken!" });
    }

    const newUser = await User.create({
      username: uname,
      password: pass,
      email,
    });
    const { password, ...rest } = newUser._doc;

    return res.status(201).json({ message: "User created!", result: rest });
  } catch (error) {
    next(error);
  }
};

// const feedback = async (req, res, next) => {
//   try {
//     console.log(req.body);
//     console.log(req.user);
//     const { NewFeedback: feedback } = req.body;
//     if (!feedback) {
//       return next(errorHandler(400, "feedback field is empty"));
//     }
//     const newFeedback = await Feedback.create({
//       feedback,
//       user: req.user.id,
//     });
//     res.status(200).json({ message: "feedback taken", result: newFeedback });
//   } catch (error) {
//     next(error);
//   }
// };
// const getFeedbacks = async (req, res, next) => {
//   try {
//     const allFeedbacksOfUser = await Feedback.find({ user: req.user.id });
//     res.status(200).json({ result: allFeedbacksOfUser });
//   } catch (error) {
//     next(error);
//   }
// };

// const editFeedbacks = async (req, res, next) => {
//   try {
//     console.log(req.body);
//     const { NewFeedback, id } = req.body;
//     if (!NewFeedback) {
//       return res.status(400).json({ message: "New feedback is required" });
//     }
//     const oldFeedback = await Feedback.findById(id).populate("user");
//     if (!oldFeedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }
//     oldFeedback.feedback = NewFeedback;
//     await oldFeedback.save();
//     res.status(200).json({ message: "Feedback edited", result: oldFeedback });
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteFeedback = async (req, res, next) => {
//   try {
//     const { id } = req.body;
//     const deletedFeedback = await Feedback.findByIdAndDelete(id);
//     if (!deletedFeedback) {
//       return res.status(404).json({ message: "Feedback not found" });
//     }
//     res
//       .status(200)
//       .json({ message: "Feedback deleted", result: deletedFeedback });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ result: allUsers });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// const fetchFeedback = async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     const query = userId ? { user: userId } : {};
//     const feedbacks = await Feedback.find(query).populate("user").limit(50);

//     res.status(200).json({ message: "Fetched feedbacks", result: feedbacks });
//   } catch (error) {
//     next(error);
//   }
// };

export {
  login,
  logout,
  register,
//   feedback,
//   getFeedbacks,
//   editFeedbacks,
//   deleteFeedback,
//   fetchFeedback,
  getAllUsers,
};