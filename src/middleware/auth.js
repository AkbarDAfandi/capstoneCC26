import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token tidak valid' });
    }
};

export const authorize = (roles = []) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Terlarang: Peran Anda tidak diizinkan.' });
        }
        next();
    };
};