import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// AUTHENTIKASI

export const register = async (req, res) => {
  try {
    const { name, email, password, role, smkMajor } = req.body;
    
    // Hash password sebelum disimpan [cite: 127]
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role, 
        smkMajor: role === 'freelancer' ? smkMajor : null 
      }
    });

    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const createUser = async (req, res) => {
//   try {
//     const user = await prisma.user.create({ data: req.body });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// export const getUsers = async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// };

// export const getUserById = async (req, res) => {
//   const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
//   user ? res.json(user) : res.status(404).json({ error: 'User not found' });
// };

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) !== req.user.id) {
      return res.status(403).json({ error: "Anda hanya bisa mengubah profil sendiri." });
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const deleteUser = async (req, res) => {
//   try {
//     await prisma.user.delete({ where: { id: Number(req.params.id) } });
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// PROJECT
export const createProject = async (req, res) => {
  try {
    const project = await prisma.project.create({ 
      data: { 
        ...req.body, 
        clientId: req.user.id 
      } 
    });
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
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id: Number(id) } });

    if (project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Anda hanya bisa mengubah proyek milik sendiri." });
    }

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) } });
    if (!project || project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Hanya pemilik proyek yang bisa menghapus." });
    }
    await prisma.project.delete({ where: { id: Number(req.params.id) } });
    res.status(204).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// APPLICATION
export const createApplication = async (req, res) => {
  try {
    const application = await prisma.application.create({ 
      data: {
        ...req.body,
        freelancerId: req.user.id
      } 
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    let applications;
    if (req.user.role === 'client') {
      applications = await prisma.application.findMany({
        where: { project: { clientId: req.user.id } },
        include: { freelancer: true, project: true }
      });
    } else {
      applications = await prisma.application.findMany({
        where: { freelancerId: req.user.id },
        include: { project: true }
      });
    }
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: Number(id) },
      include: { project: true }
    });

    if (application.project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Hanya pemilik proyek yang bisa menerima/menolak lamaran." });
    }

    const updated = await prisma.application.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await prisma.application.findUnique({ where: { id: Number(req.params.id) } });
    if (!application || application.freelancerId !== req.user.id) {
      return res.status(403).json({ error: "Anda tidak bisa membatalkan lamaran orang lain." });
    }
    await prisma.application.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// REVIEW
export const createReview = async (req, res) => {
  try {
    const review = await prisma.review.create({ 
      data: {
        ...req.body,
        reviewerId: req.user.id
      } 
    });
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
    const review = await prisma.review.findUnique({ where: { id: Number(req.params.id) } });
    if (!review || review.reviewerId !== req.user.id) {
      return res.status(403).json({ error: "Anda tidak bisa menghapus review orang lain." });
    }
    await prisma.review.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};