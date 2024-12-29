import db from '../../../../prisma/conn';
import { request, response } from 'express';

async function all_book(req = request, res = response) {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Validasi input pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (isNaN(pageNum) || pageNum <= 0 || isNaN(limitNum) || limitNum <= 0) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be positive numbers."
            });
        }

        // Pagination calculation
        const take = limitNum;
        const skip = (pageNum - 1) * take;

        // Query database
        const result = await db.books.findMany({
            take: take,
            skip: skip,
        });

        const total_data = await db.books.count();

        // Handle empty result
        if (result.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No books found.",
                query: result
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            current_page: pageNum,
            total_page: Math.ceil(total_data / limitNum),
            total_data: total_data,
            query: result
        });
    } catch (error) {
        console.error("Error fetching books:", error.message, {
            stack: error.stack,
        });
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred."
        });
    }
};

export { all_book };
