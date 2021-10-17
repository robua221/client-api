const express = require("express");
const { route, post } = require("./ticket.router");
const router = express.Router();
const { insertUser, getUserByEmail,getUserById} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const {userAuthorization}=require("../middlewares/authorization.middleware")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

//get user profile router
router.get("/",userAuthorization, async(req,res)=>{
  const _id = req.userId
const userProf =await getUserById(_id)

res.json({user:userProf})
})

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
  if (!passFromDb)
    return res.json({ status: "error", message: "Invalid email or password" });

  //compare passwords
  const result = await comparePassword(password, passFromDb);
  {
    if (!result) {
      return res.json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);
    res.json({
      status: "success",
      message: "login successfully",
      accessJWT,
      refreshJWT,
    });
  }
});

module.exports = router;

