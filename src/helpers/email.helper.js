const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  // true for 465, false for other ports
  auth: {
    user: "gaby.keller@etheral.email", // generated ethereal user
    pass: "73rewyee98fye23rBWsd", // generated ethereal password
  },
});

const send = (info) => {
  return new Promise(async(resolve, reject) => {
    try {
      // send mail with defined transport object
      let result = await transporter.sendMail(info);

      console.log("Message sent: %s", result.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};
const emailProcessor = (email, pin) => {
  const info = {
    from: '"Robua Company" <gaby.keller@etheral.email>', // sender address
    to: email, // list of receivers
    subject: "Password reset pin", // Subject line
    text: "your password reset pin" + pin + "will expire in 10 minutes", // plain text body
    html: `<b>Hello</b>
    here is your pin
    <b>${pin}</b>
    it will expire in 10 minutes`, // html body
  };
  send(info);
};
module.exports = { emailProcessor };
