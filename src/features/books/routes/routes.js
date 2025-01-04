import { Router } from 'express';
import { create_book } from '../controller/create';
import { all_book } from '../controller/list';
import { delete_book } from '../controller/delete';
import { update_book } from '../controller/update';



const books_routes = new Router();

books_routes.post('/api/book/create', create_book);

books_routes.get('/api/book/list', all_book);

books_routes.delete('/api/book/delete', delete_book);

books_routes.patch('/api/book/update', update_book);



export default books_routes