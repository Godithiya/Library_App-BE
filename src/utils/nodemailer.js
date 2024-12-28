import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'anggaadithiya@gmail.com',
    port: '465',
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export default transporter