const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateJWTToken = require("../config/generateJWTToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, profilePicture } = req.body;

  if (!firstName || !email || !password) {
    res.status(400);
    throw new Error("Required fields cannot be left empty.");
  }

  const isExistingUser = await User.findOne({ email });

  if (isExistingUser) {
    res.status(400);
    throw new Error("A user with this email already exists.");
  }

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    profilePicture,
  });

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      profilePicture: newUser.profilePicture,
      auth_token: generateJWTToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("An error occured while creating the user.");
  }
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.checkPasswordMatch(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      auth_token: generateJWTToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect Email or Password");
  }
});

// fetch user - /api/user?search=dwm
const fetchUser = expressAsyncHandler(async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        $or: [
          // $or - performs logical OR on an array of expressions
          { firstName: { $regex: req.query.search, $options: "i" } }, // $regex - patterns matches strings using regex
          { lastName: { $regex: req.query.search, $options: "i" } }, // $options - "i" instructs case insensitive search
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(searchKeyword).find({
    _id: { $ne: req.user._id }, // #ne - not equals
  });

  res.send(users);
});

module.exports = { registerUser, loginUser, fetchUser };
