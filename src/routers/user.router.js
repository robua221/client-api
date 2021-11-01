const express = require("express");
const { route, post } = require("./ticket.router");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin,
} = require("../model/reset Pin/resetPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {
  resetPassReqValidation,
  updatePassValidation,
} = require("../middlewares/formValidation.middleware");
const { deleteJWT } = require("../helpers/redis.helper");
router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

//get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;
  const userProf = await getUserById(_id);

  res.json({ user: userProf });
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

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (user && user._id) {
    const setPin = await setPasswordResetPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });

    return res.json({
      status: "success",
      message: "if email exists then password reset pin will be send shortly",
    });
  }

  return res.json({
    status: "error",
    message: "if email exists then password reset pin will be send shortly",
  });
});
router.patch("/reset-password", updatePassValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPinByEmailPin(email, pin);
  if (getPin._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;
    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
    today = new Date();
    if (today > expDate) {
      return res.json({ status: "error", message: "Invalid or expired pin " });
    }

    const hashedPass = await hashPassword(newPassword);
    const user = await updatePassword(email, hashedPass);
    if (user._id) {
      await emailProcessor({ email, type: "password-update-sucess" });
      deletePin(email, pin);
      return res.json({
        status: "success",
        message: "password changed !! ",
      });
    }
  }
  res.json({
    status: "error",
    message: "unable to update your password . please try again later",
  });
});
router.delete("/logout",userAuthorization,async (req, res) => {
  const{authorization}=req.headers
  const _id = req.userId;
  deleteJWT(authorization)
   const result=await storeUserRefreshJWT(_id,'')
   if(result_id){
     return res.json({status:"success" ,message:"loged out"})
   }
///
  res.json({status:"error" ,message:"unable to logout"});
});
module.exports = router;
