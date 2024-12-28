import { query, request, response } from 'express';
import db from '../../../../prisma/conn';
import jwt from 'jsonwebtoken';
import transporter from '../../../utils/nodemailer';

const PORT = process.env.PORT

const register_user = async ( req = request, res = response ) => {
    try {
        const { name, email, password } = req.body;

        const user = await db.unverifiedUser.create({
            data: {
                name : name,
                email : email,
                password : password
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
            text: `New link: http://localhost:${PORT}/api/user/verify?token=${token}`
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