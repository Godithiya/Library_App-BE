import db from '../../../prisma/conn';
import { request, response } from 'express';

async function delete_book(req = request, res = response) {
    try {
        const { ids } = await req.body;

        // Validasi input 'ids'
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid input: 'ids' must be a non-empty array."
            });
        }

        // Validate whether the data with the given ID exists in the database.
        const existingBooks = await db.books.findMany({
            where: {
                id: { in: ids }
            }
        });

        if (existingBooks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No books found with the given IDs."
            });
        }

        // Delete data from database
        const result = await db.books.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        // Success response
        return res.status(200).json({
            success: true,
            message: `Success delete ${result.count} data!`
        });
    } catch (error) {
        // Error log for debugging
        console.error("Error deleting books:", error.message, {
            stack: error.stack,
        });
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { delete_book };
