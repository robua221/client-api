const bcrypt = require("bcrypt");
const saltRounds = 10;
const hashPassword = (plainPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPassword, saltRounds));
  }); 

  
};
const comparePassword=(plainPass,passwordFromDb)=>{
  return new Promise((resolve,reject)=>{

    bcrypt.compare(plainPass, passwordFromDb, function(err, result) {
      if(err) reject (err);
      resolve(result)
  }); 
  })
}
module.exports = {
  hashPassword,comparePassword
};
