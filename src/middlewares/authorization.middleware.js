const { verifyAccessJwt } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;//jwt header

  const decoded = await verifyAccessJwt(authorization);
  
  if (decoded.email) {
    const userId = await getJWT(authorization);

    if (!userId) {
      return res.status(403).json({ message: "forbidden" });
    }
    req.userId = userId;

    return next();
  }
  deleteJWT(authorization);
  
  return res.status(403).json({ message: "forbidden" });
};
module.exports = {
  userAuthorization,
};
