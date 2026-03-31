import express from 'express';
import * as controller from './controllers.js';

const router = express.Router();

router.post('/users', controller.createUser);
router.get('/users', controller.getUsers);
router.get('/users/:id', controller.getUserById);
router.put('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

router.post('/projects', controller.createProject);
router.get('/projects', controller.getProjects);
router.get('/projects/:id', controller.getProjectById);
router.put('/projects/:id', controller.updateProject);
router.delete('/projects/:id', controller.deleteProject);

router.post('/applications', controller.createApplication);
router.get('/applications', controller.getApplications);
router.put('/applications/:id', controller.updateApplication);
router.delete('/applications/:id', controller.deleteApplication);

router.post('/reviews', controller.createReview);
router.get('/reviews', controller.getReviews);
router.delete('/reviews/:id', controller.deleteReview);

export default router;