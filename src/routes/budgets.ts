import * as express from "express";
const router = express.Router();
import budgetController from "../controllers/budgetController";

/* listing all routes */
router.post("/add", budgetController.add);
router.get("/get/:id", budgetController.get);
router.get("/get-list/:pageNo?/:limit?", budgetController.getAll);
router.put("/edit/:id", budgetController.update);
router.delete("/delete/:id", budgetController.delete);

export default router;
