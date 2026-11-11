import { Router } from "express";

import routerv1 from "./routerV1"

const router = Router();

router.use("/v1", routerv1);

export default router;