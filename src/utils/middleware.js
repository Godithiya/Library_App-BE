import { request, response } from 'express';
import jwt from 'jsonwebtoken';

async function validateUser ( req = request, res = response, next ) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            res.status(401).json({
                status: false,
                message: 'Unauthorized'
            })
        };

        const token = authHeader.split(" ")[1]
        if(!token) {
            res.status(401).json({
                status: false,
                message: "Invalid token"
            })
        };

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decodedToken.userId;
        next()
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            status: false,
            message: error.name
        })
    }
}

export default validateUser