import express, { urlencoded } from 'express';
import cors from 'cors';
import env from 'dotenv';
import user_routes from './features/auth/routes/user_routes';
import books_routes from './features/books/routes/routes';

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({
    limit: '100mb'
}));
app.use(express.urlencoded({    
    extended: true
}));


app.use(books_routes)
app.use(user_routes)

app.listen(PORT, '0.0.0.0', () => {
    console.info(`
        ========================================
        Server running on http://0.0.0.0:${PORT}
        ========================================
        `)
})