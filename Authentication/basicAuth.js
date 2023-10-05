import User from "../model/UserModel.js";
import bcrypt from "bcrypt";
// import sequelize from '../config/database';

const basicAuth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Basic")
    ) {
      const base64Credentials = req.headers.authorization.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
      );
      const [email, password] = credentials.split(":");

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log("Please give correct Credentials");
        return res.status(401).json({ message: "Authentication failed" });
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Authentication header missing" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Authentication error", error: error.message });
  }
};

export default basicAuth;
