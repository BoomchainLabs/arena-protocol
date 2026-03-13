import { Router, type IRouter } from "express";
import healthRouter from "./health";
import arenaRouter from "./arena";

const router: IRouter = Router();

router.use(healthRouter);
router.use(arenaRouter);

export default router;
