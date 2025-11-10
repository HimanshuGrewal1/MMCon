import express from "express";

import { verifyToken } from "../middlewares/verifyToken.js";
import { createContent, getContentByProjectId } from "../controllers/content.controller.js";

const router = express.Router();

router.post("/:projectId", createContent);
router.get("/:projectId", getContentByProjectId);

export default router;