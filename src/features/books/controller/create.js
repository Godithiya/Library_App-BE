import db from '../../../../prisma/conn';
import { request, response } from 'express';

async function create_book(req = request, res = response) {
    try {
        const { title, author, genre, publication_year, stock } = req.body;

        // Validasi input
        if (!title || typeof title !== 'string' || 
            !author || typeof author !== 'string' || 
            !genre || typeof genre !== 'string' || 
            !publication_year || typeof publication_year !== 'number' || 
            !stock || typeof stock !== 'number') {
            return res.status(400).json({
                success: false,
                message: "Invalid input: ensure all fields are filled and data types are correct."
            });
        }

        // Publication year validation
        const currentYear = new Date().getFullYear();
        if (publication_year > currentYear) {
            return res.status(400).json({
                success: false,
                message: "Invalid publication year: cannot be in the future."
            });
        }

        // Check for data duplication
        const existingBook = await db.books.findFirst({
            where: { title, author }
        });

        if (existingBook) {
            return res.status(409).json({
                success: false,
                message: "A book with the same title and author already exists."
            });
        }

        // Save data to database
        const result = await db.books.create({
            data: { title, author, genre, publication_year, stock }
        });

        // Success response
        return res.status(201).json({
            success: true,
            message: "Book created successfully!",
            query: result
        });
    } catch (error) {
        // Error log for debugging
        console.error("Error creating book:", error.message, { stack: error.stack });
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred."
        });
    }
}

export { create_book };
