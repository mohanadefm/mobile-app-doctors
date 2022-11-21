import jsonwebtoken from "jsonwebtoken";
import models from "../models";

const isLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({ message: "الرجاء تسجيل الدخول" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.currentUser = decoded;
    next();
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export default isLoggedIn;
