import express from 'express';
import { createProject, getProject, getProjectsByUser } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/project', verifyToken, createProject);
router.get('/project', verifyToken, getProjectsByUser);
router.get('/project/:projectId', verifyToken, getProject);

export default router;