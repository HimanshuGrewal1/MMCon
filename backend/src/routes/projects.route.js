import express from 'express';
import { AddEdge, AddNote, createProject, getProject, getProjectsByUser } from '../controllers/project.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/project', verifyToken, createProject);
router.get('/project', verifyToken, getProjectsByUser);
router.get('/project/:projectId', getProject);
router.post('/project/:projectId/creatNode', verifyToken, AddNote);
router.post('/project/:projectId/creatEdge', verifyToken, AddEdge);

export default router;