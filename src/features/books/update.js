import db from "../../../prisma/conn";
import { request, response } from "express";

async function update_book ( req = request, res = response ) {
    try {
        const { id, data } = await req.body;

        // validasi id
        if(!id || typeof id !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'ID is required and must be a number'
            });
        };

        // validasi data
        if(!data || typeof data !== 'object' || Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Data is required and must be a non-empty object'
            });
        };

        const result = await db.books.update({
            where: {
                id
            },
            data : data 
        });

        return res.status(201).json({
            success: true,
            message: 'Success update data book',
            data: result
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export {
    update_book
}