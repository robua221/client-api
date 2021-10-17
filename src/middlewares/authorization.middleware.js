const { verifyAccessJwt } = require("../helpers/jwt.helper");
const { getJWT } = require("../helpers/redis.helper");

const userAuthorization = async(req, res, next) => {
  const { authorization } = req.headers;
  
  const decoded = await verifyAccessJwt(authorization);
  console.log(decoded)
  if (decoded.email) {
    const userId = await getJWT(authorization);
      
    if (!userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    req.userId=userId
    
  return next();
  }
 return res.status(403).json({ message: "forbidden" });
};
module.exports = {
  userAuthorization,
};
