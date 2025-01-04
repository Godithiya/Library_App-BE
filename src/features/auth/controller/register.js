import { query, request, response } from 'express';
import db from '../../../../prisma/conn';
import jwt from 'jsonwebtoken';
import transporter from '../../../utils/nodemailer';
import { hashPassword } from '../../../utils/hasher';

const PORT = process.env.PORT

const register_user = async ( req = request, res = response ) => {
    try {
        const { name, email, password } = req.body;

        const user = await db.unverifiedUser.create({
            data: {
                name : name,
                email : email,
                password : hashPassword(password)
            }
        });

        if(!name || !email || !password){
            return res.status(400).send('All fields are required!');
        }
        
        // generate token for email verification
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY);

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verification Email",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f7;
                        color: #333333;
                    }
                    .email-container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px;
                        background-color: #5865f2;
                        color: #ffffff;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 20px;
                        background-color: #5865f2;
                        color: #ffffff;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777777;
                    }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                    <div class="header">
                        <h1>Verifikasi Email Anda</h1>
                    </div>
                    <div class="content">
                        <p>Halo,</p>
                        <p>Terima kasih telah mendaftar! Klik tombol di bawah ini untuk memverifikasi email Anda.</p>
                        <a
                        class="button"
                        href="http://localhost:${PORT}/api/user/verify?token=${token}"
                        target="_blank"
                        >Verifikasi Sekarang</a>
                        <p>Jika Anda tidak mendaftar akun, abaikan email ini.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 PT. Godithiya. Semua hak dilindungi.</p>
                    </div>
                    </div>
                </body>
                </html>
            `,
        });

        return res.status(201).json({
            success: true,
            message: "Success register user, please check your email to verify your account",
            query: user
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


export default register_user