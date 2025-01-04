import { query, request, response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../../../../prisma/conn';

const renderSuccessPage = () => `
<!DOCTYPE html>
<html>
<head>
    <title>Verifikasi Berhasil</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f7;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .card {
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
        }
        h1 {
            color: #5865f2;
        }
        p {
            font-size: 16px;
            margin: 10px 0;
        }
        .icon {
            font-size: 60px;
            color: #5865f2;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #5865f2;
            text-decoration: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #4752c4;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="icon">🎉</div>
            <h1>Verifikasi Berhasil!</h1>
            <p>Terima kasih telah memverifikasi email Anda. Sekarang Anda dapat masuk ke akun Anda.</p>
            <a href="/login" class="button">Masuk Sekarang</a>
        </div>
    </div>
</body>
</html>
`;

const renderErrorPage = (errorMessage) => `
<!DOCTYPE html>
<html>
<head>
    <title>Verifikasi Gagal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f7;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .card {
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
        }
        h1 {
            color: #ff4d4f;
        }
        p {
            font-size: 16px;
            margin: 10px 0;
        }
        .icon {
            font-size: 60px;
            color: #ff4d4f;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #ff4d4f;
            text-decoration: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #d9363e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="icon">❌</div>
            <h1>Verifikasi Gagal</h1>
            <p>${errorMessage}</p>
            <a href="/register" class="button">Daftar Ulang</a>
        </div>
    </div>
</body>
</html>
`;

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

        return res.status(200).send(renderSuccessPage());
    } catch (error) {
        console.log(error);
        return res.status(400).send(renderErrorPage(error.message));
    }
};


export default verify_user