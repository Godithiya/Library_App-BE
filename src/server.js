import express, { urlencoded } from 'express';
import cors from 'cors';
import env from 'dotenv';
import books_routes from './features/books/routes';
import user_routes from './features/users/routes/user_routes';

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

app.listen(PORT, () => {
    console.info(`
        ==================================
        Server running on localhost:${PORT}
        ==================================
        `)
})