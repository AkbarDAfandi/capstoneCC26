import express from 'express';
import * as controller from './controllers.js';
import { authenticate, authorize } from './middleware/auth.js';

const router = express.Router();

// AUTHENTIKASI
router.post('/register', controller.register);
router.get('/verify-email', controller.verifyEmail)
router.post('/login', controller.login);
router.put('/users/:id', authenticate, controller.updateUser);

// router.post('/users', controller.createUser);
// router.get('/users', controller.getUsers);
router.get('/users/:id', controller.getUserById);
// router.delete('/users/:id', controller.deleteUser);

// ROUTES PROJECT
router.get('/projects', controller.getProjects);
router.get('/projects/:id', controller.getProjectById);
router.post('/projects', authenticate, authorize(['client']), controller.createProject);
router.put('/projects/:id', authenticate, authorize(['client']), controller.updateProject);
router.delete('/projects/:id', authenticate, authorize(['client']), controller.deleteProject);

router.post('/applications', authenticate, authorize(['freelancer']), controller.createApplication);
router.get('/applications', authenticate, controller.getApplications);
router.put('/applications/:id', authenticate, authorize(['client']), controller.updateApplication);
router.delete('/applications/:id', authenticate, authorize(['freelancer']), controller.deleteApplication);

router.post('/reviews', authenticate, controller.createReview);
router.get('/reviews', controller.getReviews);
router.delete('/reviews/:id', authenticate, controller.deleteReview);

export default router;