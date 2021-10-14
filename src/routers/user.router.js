const express = require("express");
const { route, post } = require("./ticket.router");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { json } = require("body-parser");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

//create new user route
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;

  try {
    //hash password

    const hashedPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const result = await insertUser(newUserObj);
    console.log(result);
    res.json({ message: "NEW USER CREATED ", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});
// user sign in Router
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid Credentials" });
  }
  //get user with db

  const user = await getUserByEmail(email);
  const passFromDb = user && user._id ? user.password : null;
  if(!passFromDb)
  return res.json({ status: "error", message: "Invalid email or password" });


  res.json({ status: "success", message: "login successfully" });
  //compare passwords
  const result=await comparePassword(password,passFromDb)
  console.log(result)
});

module.exports = router;
