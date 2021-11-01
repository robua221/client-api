const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  // true for 465, false for other ports
  auth: {
    user: "dayna.davis54@ethereal.email", // generated ethereal user
    pass: "2ubd3W5yeJmAM3HCMs", // generated ethereal password
  },
});

const send = (info) => {
  return new Promise(async (resolve, reject) => {
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
const emailProcessor = ({email, pin, type}) => {
  let info = "";
  switch (type) {
    case "request-new-password":
      info = {
        from: '"Robua Company" <dayna.davis54@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password reset pin", // Subject line
        text: "your password reset pin" + pin + "will expire in 10 minutes", // plain text body
        html: `<b>Hello</b>
        here is your pin
        <b>${pin}</b>
        it will expire in 10 minutes`, // html body
      };
      send(info);

      break;
    case "password-update-sucess":
      info = {
        from: '"Robua Company" <dayna.davis54@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password updated", // Subject line
        text: "your password has been updated", // plain text body
        html: `<b>Hello</b>
         
           <p>your new password has been updated</p>`, // html body
      };
      send(info);

    default:
      break;
  }
};
module.exports = { emailProcessor };
