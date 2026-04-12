import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import 'dotenv/config';
import crypto from 'crypto'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from './middleware/sendVerificationEmail.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const parseId = (idString) => {
  const id = Number(idString);
  return isNaN(id) ? null : id;
};

// AUTENTIKASI

export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, smkMajor, skills, hourlyRate, portfolioUrl } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' })
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Transaction supaya user + token dibuat bersamaan (atomic)
    const user = await prisma.$transaction(async (tx) => {
      const userBaru = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          bio,
          smkMajor: role === 'freelancer' ? smkMajor : null,
          skills: role === 'freelancer' ? skills : null,
          portfolioUrl: role === 'freelancer' ? portfolioUrl : null,
          hourlyRate: role === 'freelancer' && hourlyRate ? parseFloat(hourlyRate) : null
        }
      });

      await tx.verificationToken.create({
        data: { userId: userBaru.id, token, expiresAt }
      });

      return userBaru;
    });

    // Kirim verifikasi email lewat resend
    await sendVerificationEmail(email, token)

    res.status(201).json({
      message: 'Registrasi berhasil! Cek email kamu untuk verifikasi.',
      userId: user.id
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query

    const record = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!record) {
      return res.status(400).json({ error: 'Token tidak valid.' })
    }

    if (record.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return res.status(400).json({ error: 'Link sudah kadaluarsa. Silakan daftar ulang.' })
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { isVerified: true }
      }),
      prisma.verificationToken.delete({ where: { token } })
    ])

    return res.json({ message: 'Email berhasil diverifikasi!' })

  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Harap verifikasi email kamu terlebih dahulu.' });
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

export const getUserById = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  user ? res.json(user) : res.status(404).json({ error: 'User not found' });
};

export const updateUser = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id || id !== req.user.id) {
      return res.status(403).json({ error: "Anda hanya bisa mengubah profil sendiri." });
    }

    // data yang boleh diupdate
    const { name, bio, smkMajor, skills, portfolioUrl, hourlyRate } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(smkMajor !== undefined && { smkMajor }),
        ...(skills !== undefined && { skills }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(hourlyRate !== undefined && { hourlyRate: parseFloat(hourlyRate) })
      },
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
    const { title, description, category, budgetMin, budgetMax, deadline } = req.body;
    const project = await prisma.project.create({
      data: {
        title, description, category,
        budgetMin: parseFloat(budgetMin),
        budgetMax: parseFloat(budgetMax),
        deadline: deadline ? new Date(deadline) : null,
        client: {
          connect: { id: req.user.id }
        }
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ include: { client: true } });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const project = await prisma.project.findUnique({
      where: { id },
      include: { client: true, applications: true }
    });
    project ? res.json(project) : res.status(404).json({ error: 'Project not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) return res.status(404).json({ error: "Project tidak ditemukan" });
    if (project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Anda hanya bisa mengubah proyek milik sendiri." });
    }

    const { title, description, category, budgetMin, budgetMax, deadline, status } = req.body;

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(budgetMin !== undefined && { budgetMin: parseFloat(budgetMin) }),
        ...(budgetMax !== undefined && { budgetMax: parseFloat(budgetMax) }),
        ...(deadline !== undefined && { deadline: new Date(deadline) }),
        ...(status !== undefined && { status }),
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ error: "Project tidak ditemukan" });
    if (project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Hanya pemilik proyek yang bisa menghapus." });
    }
    await prisma.project.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// APPLICATION
export const createApplication = async (req, res) => {
  try {
    const { projectId, proposal, offeredPrice } = req.body;
    const application = await prisma.application.create({
      data: {
        projectId: Number(projectId),
        proposal,
        offeredPrice: offeredPrice ? parseFloat(offeredPrice) : null,
        freelancerId: req.user.id
      }
    });
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'Kamu sudah pernah mengirimkan penawaran untuk proyek ini sebelumnya.' 
      });
    }
    res.status(500).json({ error: 'Terjadi kesalahan sistem.' });
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
        include: { project: { include: { client: true } } }
      });
    }
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!application) return res.status(404).json({ error: "Lamaran tidak ditemukan" });
    if (application.project.clientId !== req.user.id) {
      return res.status(403).json({ error: "Hanya pemilik proyek yang bisa menerima/menolak lamaran." });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const application = await prisma.application.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ error: "Lamaran tidak ditemukan" });
    if (application.freelancerId !== req.user.id) {
      return res.status(403).json({ error: "Anda tidak bisa membatalkan lamaran orang lain." });
    }
    await prisma.application.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// REVIEW
export const createReview = async (req, res) => {
  try {
    const { projectId, revieweeId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: {
        projectId: Number(projectId),
        revieweeId: Number(revieweeId),
        rating: Number(rating),
        comment,
        reviewerId: req.user.id
      }
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        reviewer: { select: { id: true, name: true } },
        reviewee: { select: { id: true, name: true } },
        project: { select: { id: true, title: true, clientId: true } }
      }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: 'ID tidak valid' });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review tidak ditemukan" });
    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({ error: "Anda tidak bisa menghapus review orang lain." });
    }
    await prisma.review.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};