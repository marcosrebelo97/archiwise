import { Router } from "express";

import userRouter from "../resources/user/user.router";
import authRouter from "../resources/auth/auth.router";
import documentRouter from "../resources/document/document.router";
import categoryRouter from "../resources/category/category.router";
import searchRouter from "../resources/search/search.router"
import dashboardRouter from "../resources/dashboard/dashboard.router"

const router = Router();

router.use("/users",
    // #swagger.tags = ['User']
    userRouter
);

router.use(
    "/auth",
    // #swagger.tags = ['Auth']
    authRouter
);

router.use(
    "/docs",
    // #swagger.tags = ['Document']
    documentRouter
)

router.use(
    "/categories",
    // #swagger.tags = ['Categories']
    categoryRouter
)

router.use(
    "/searches",
    // #swagger.tags = ['Search']
    searchRouter
)

router.use(
    "/dashboard",
    // #swagger.tags = ['Dashboard']
    dashboardRouter
)

export default router;
