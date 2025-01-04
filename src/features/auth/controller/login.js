import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../../../prisma/conn';
import bcrypt from 'bcryptjs';

async function login_user(req = request, res = response) {
    try {
        const { email, password } = req.body;
        const emailCase = email?.toLowerCase();

        // Validasi input
        if (!emailCase || !password) {
            return res.status(400).json({
                status: false,
                message: "Email dan password harus diisi.",
            });
        }

        // Cari user berdasarkan email
        const findUser = await db.user.findUnique({
            where: {
                email: emailCase,
            },
        });

        if (!findUser) {
            return res.status(404).json({
                status: false,
                message: "User dengan email ini tidak ditemukan.",
            });
        }

        // Verifikasi password
        const truePass = await bcrypt.compare(password, findUser.password);
        if (!truePass) {
            return res.status(401).json({
                status: false,
                message: "Password yang Anda masukkan salah.",
            });
        }

        // Generate token JWT
        const jwt_key = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ userId: findUser.id }, jwt_key, {
            expiresIn: "1d",
        });

        // Berikan respons sukses
        res.status(200).json({
            status: true,
            message: "Login berhasil.",
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan pada server.",
            error: error.message,
        });
    }
}

export default login_user;
