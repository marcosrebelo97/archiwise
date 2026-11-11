import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.patch('/', authController.update);
router.put('/update-password', authController.updatePassword);

export default router;