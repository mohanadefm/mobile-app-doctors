import bcrypt from "bcryptjs";
import models from "../models";
import jsonwebtoken from "jsonwebtoken";

export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    userType,
    specialization,
    address,
    location,
    phone,
    workingHours,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude,
    });

    if (userType === "doctor") {
      const profile = await models.Profile.create({
        userId: user.id,
        specialization,
        address,
        phone,
        workingHours,
      });
    }

    res.status(200).json({ message: "تم إنشاء حسابك بنجاح" });
  } catch (error) {
    // console.log(error)
    res.status(500).json(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "البريد الالكتروني أو كلمة المرور غير صحيحة" });
    }

    const authSuccess = await bcrypt.compare(password, user.password);

    if (authSuccess) {
      const token = jsonwebtoken.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET
      );
      res.status(200).json({ accessToken: token });
    }
  } catch (error) {
    res.status(500).json(e);
  }
};

export const me = (req, res) => {
  const user = req.currentUser;
  res.json(user);
};

export const getProfile = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: { id: req.currentUser.id },
      include: [{ model: models.Profile, as: "profile" }],
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllUser = async (req, res) => {
  try {
    const result = await models.User.findAll({});
    if(result.length==0) {
      return res.status(200).json({message:'No users!'})
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const removeUser = async (req, res) => {
  try {
    const result = await models.User.destroy({where: {}})
    // const result = await models.User.destroy({ where: { id: req.currentUser.id } });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
