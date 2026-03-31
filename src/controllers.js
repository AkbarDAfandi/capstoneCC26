import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const createUser = async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  user ? res.json(user) : res.status(404).json({ error: 'User not found' });
};

export const updateUser = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({ include: { client: true } });
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const project = await prisma.project.findUnique({ 
    where: { id: Number(req.params.id) },
    include: { client: true, applications: true }
  });
  project ? res.json(project) : res.status(404).json({ error: 'Project not found' });
};

export const updateProject = async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const application = await prisma.application.create({ data: req.body });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  const applications = await prisma.application.findMany();
  res.json(applications);
};

export const updateApplication = async (req, res) => {
  try {
    const application = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    await prisma.application.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReviews = async (req, res) => {
  const reviews = await prisma.review.findMany();
  res.json(reviews);
};

export const deleteReview = async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};