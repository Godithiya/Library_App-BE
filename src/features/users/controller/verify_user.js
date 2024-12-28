import { query, request, response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../../../prisma/conn';

const verify_user = async ( req = request, res = response ) => {
    try {
        const token = req.query.token;

        if(!token) {
            return res.status(400).send('token is missing!')
        }

        // verify jwt
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // find the unverified user by token
        const unverifiedUser = await db.unverifiedUser.findUnique({
            where: {
                id: decoded.userId
            }
        });

        if(!unverifiedUser){
            return res.status(404).send('User not found or already verified')
        };

        // move user data to user table
        const user = await db.user.create({
            data: {
                name: unverifiedUser.name,
                email: unverifiedUser.email,
                password: unverifiedUser.password
            }
        });

        await db.unverifiedUser.delete({
            where: {
                id: decoded.userId
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Success Verification Email',
            query: user
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};


export default verify_user