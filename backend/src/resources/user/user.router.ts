import { Router } from "express"

import userController from "./user.controller";
import userSchema from "./user.schema";
import { validate } from "../../middlewares/validate";

const router = Router();

router.get('/', userController.index);
router.post('/', validate(userSchema), userController.create);
router.get('/:id', userController.read);
router.put('/:id', validate(userSchema), userController.update);
router.delete('/:id', userController.remove);

router.post("/forgot-password", userController.requestPasswordReset);
router.patch("/reset-password", userController.resetPassword);
router.get("/verify-password-reset/:token", userController.verifyPasswordResetToken);

export default router;