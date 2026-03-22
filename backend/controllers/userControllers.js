import { createToken } from "../middleware/verifyUser.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/User.js";

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


const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ result: allUsers });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



export {
  login,
  logout,
  register,
  getAllUsers,
};