import express from "express";
import * as userController from "../controllers/userController";
import * as doctorController from "../controllers/doctorController";
import validate from "../handlers/validation";
import { saveUser } from "../middlewares/validators";
import isLoggedIn from "../middlewares/auth";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// User Routes
router.post("/account/signup", validate(saveUser), userController.register);
router.post("/account/signin", userController.login);
router.get("/account/me", isLoggedIn, userController.me);
router.get("/account/profile", isLoggedIn, userController.getProfile);
router.get("/account/users", userController.getAllUser);
router.delete("/account/delete", isLoggedIn, userController.removeUser);

// Doctor Routes
router.get("/doctors", doctorController.index);

export default router;
