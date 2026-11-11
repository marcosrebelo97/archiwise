import Router from "express";
import dashboardController from "./dashboard.controller";
import { isAuthenticated } from "../../middlewares/isAuthenticated";

const router = Router();

router.get('',
    /*
        #swagger.description = "Queries do dashboard."
    */
    isAuthenticated,
    dashboardController.dashboardQueries
)


export default router;