import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  { operatorsAliases: false, dialect: "postgres",logging:false }
);

const models = {
  User: sequelize.import("./user.js"),
  Profile: sequelize.import("./profile.js"),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((err) => {
    console.log("Unable to connect to the database", err);
  });

export { sequelize };
export default models;
