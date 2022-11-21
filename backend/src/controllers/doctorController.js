import Sequelize from "sequelize";
import models from "../models";

const Op = Sequelize.Op;

export const index = async (req, res) => {
  let { q } = req.query;
  try {
    const searchQuery = q
      ? { name: { [Op.iLike]: `%${q.replace(" ", "")}%` } }
      : {};
    const doctors = await models.User.findAll({
      where: { userType: "doctor", ...searchQuery },
      include: [{ model: models.Profile, as: "profile" }],
      attributes: { exclude: ["password"] },
    });
    res.status(200).send(doctors);
  } catch (error) {
    res.status(500).send(error);
  }
};
