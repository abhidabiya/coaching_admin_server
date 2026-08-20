var connection = require("../config/connection");



// ============================================
// 1. ADD NOTE - POST /add_note
// ============================================
const addNote = async (request, response) => {
    try {
        const { title, description, category, date } = request.body;

        // Validation
        if (!title) {
            return response.status(400).json({
                success: false,
                msg: "Title is required",
                key: "title"
            });
        }

        if (title.trim().length < 3) {
            return response.status(400).json({
                success: false,
                msg: "Title must be at least 3 characters",
                key: "title"
            });
        }

        if (!date) {
            return response.status(400).json({
                success: false,
                msg: "Date is required",
                key: "date"
            });
        }

        // Check for duplicate title (removed user_id check)
        const checksql = `SELECT note_id FROM notes_master WHERE title = ? AND delete_flag = 0`;
        const checkResult = await new Promise((resolve, reject) => {
            connection.query(checksql, [title.trim()], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (checkResult.length > 0) {
            return response.status(409).json({
                success: false,
                msg: "A note with this title already exists",
                key: "duplicate_title"
            });
        }

        // Insert note (removed user_id)
        const sql = `INSERT INTO notes_master 
                     (title, description, category, date, createtime, mysqltime) 
                     VALUES (?, ?, ?, ?, NOW(), NOW())`;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                sql,
                [
                    title.trim(),
                    description ? description.trim() : '',
                    category || 'Personal',
                    date
                ],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });

        if (result && result.insertId) {
            // Fetch the inserted record
            const getSql = `SELECT 
                                note_id as id,
                                title,
                                description,
                                category,
                                DATE_FORMAT(date, '%Y-%m-%d') as date,
                                DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime,
                                DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') as updatetime
                            FROM notes_master 
                            WHERE note_id = ?`;
            
            const insertedData = await new Promise((resolve, reject) => {
                connection.query(getSql, [result.insertId], (err, data) => {
                    if (err) reject(err);
                    else resolve(data[0]);
                });
            });

            return response.status(201).json({
                success: true,
                msg: "Note added successfully",
                key: 200,
                data: insertedData
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to add note",
            key: 500
        });

    } catch (error) {
        // console.error('Add Note Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 2. GET ALL NOTES - GET /get_all_notes
// ============================================
const getAllNotes = async (request, response) => {
    try {
        const { category, limit, offset } = request.query;

        let sql = `SELECT 
                    note_id as id,
                    title,
                    description,
                    category,
                    DATE_FORMAT(date, '%Y-%m-%d') as date,
                    DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime,
                    DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') as updatetime
                   FROM notes_master 
                   WHERE delete_flag = 0`;
        
        const values = [];

        if (category) {
            sql += ` AND category = ?`;
            values.push(category);
        }

        sql += ` ORDER BY createtime DESC`;

        if (limit) {
            sql += ` LIMIT ?`;
            values.push(parseInt(limit));
        }
        if (offset) {
            sql += ` OFFSET ?`;
            values.push(parseInt(offset));
        }

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Get total count (removed user_id condition)
        const countSql = `SELECT COUNT(*) as total FROM notes_master WHERE delete_flag = 0`;
        const countResult = await new Promise((resolve, reject) => {
            connection.query(countSql, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result && result.length > 0) {
            return response.status(200).json({
                success: true,
                msg: "Notes fetched successfully",
                key: 200,
                data: result,
                total: result.length,
                total_all: countResult[0].total
            });
        }

        return response.status(200).json({
            success: true,
            msg: "No notes found",
            key: 200,
            data: [],
            total: 0,
            total_all: 0
        });

    } catch (error) {
        // console.error('Get All Notes Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 3. GET SINGLE NOTE - GET /get_note/:id
// ============================================
const getNoteById = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid note ID",
                key: 400
            });
        }

        const sql = `SELECT 
                        note_id as id,
                        title,
                        description,
                        category,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime,
                        DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') as updatetime
                     FROM notes_master 
                     WHERE note_id = ? AND delete_flag = 0`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result && result.length > 0) {
            return response.status(200).json({
                success: true,
                msg: "Note fetched successfully",
                key: 200,
                data: result[0]
            });
        }

        return response.status(404).json({
            success: false,
            msg: "Note not found",
            key: 404,
            data: null
        });

    } catch (error) {
        // console.error('Get Single Note Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 4. UPDATE NOTE - PUT /update_note/:id
// ============================================
const updateNote = async (request, response) => {
    try {
        const { id } = request.params;
        const { title, description, category, date } = request.body;

        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid note ID",
                key: 400
            });
        }

        // Check if note exists (removed user_id condition)
        const checkSql = `SELECT note_id FROM notes_master WHERE note_id = ? AND delete_flag = 0`;
        const checkResult = await new Promise((resolve, reject) => {
            connection.query(checkSql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (checkResult.length === 0) {
            return response.status(404).json({
                success: false,
                msg: "Note not found",
                key: 404
            });
        }

        // Build update query
        const fields = [];
        const values = [];

        if (title) {
            if (title.trim().length < 3) {
                return response.status(400).json({
                    success: false,
                    msg: "Title must be at least 3 characters",
                    key: "title"
                });
            }
            fields.push('title = ?');
            values.push(title.trim());
        }

        if (description !== undefined) {
            fields.push('description = ?');
            values.push(description.trim() || '');
        }

        if (category) {
            fields.push('category = ?');
            values.push(category);
        }

        if (date) {
            fields.push('date = ?');
            values.push(date);
        }

        if (fields.length === 0) {
            return response.status(400).json({
                success: false,
                msg: "No fields to update",
                key: 400
            });
        }

        fields.push('updatetime = NOW()');
        values.push(id);

        const sql = `UPDATE notes_master 
                     SET ${fields.join(', ')} 
                     WHERE note_id = ? AND delete_flag = 0`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows > 0) {
            // Fetch updated record
            const getSql = `SELECT 
                                note_id as id,
                                title,
                                description,
                                category,
                                DATE_FORMAT(date, '%Y-%m-%d') as date,
                                DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime,
                                DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') as updatetime
                            FROM notes_master 
                            WHERE note_id = ? AND delete_flag = 0`;
            
            const updatedData = await new Promise((resolve, reject) => {
                connection.query(getSql, [id], (err, data) => {
                    if (err) reject(err);
                    else resolve(data[0]);
                });
            });

            return response.status(200).json({
                success: true,
                msg: "Note updated successfully",
                key: 200,
                data: updatedData
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to update note",
            key: 500
        });

    } catch (error) {
        // console.error('Update Note Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 5. DELETE NOTE - DELETE /delete_note/:id
// ============================================
const deleteNote = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid note ID",
                key: 400
            });
        }

        // Check if note exists and get title for response (removed user_id condition)
        const checkSql = `SELECT title FROM notes_master WHERE note_id = ? AND delete_flag = 0`;
        const checkResult = await new Promise((resolve, reject) => {
            connection.query(checkSql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (checkResult.length === 0) {
            return response.status(404).json({
                success: false,
                msg: "Note not found",
                key: 404
            });
        }

        const noteTitle = checkResult[0].title;

        // Soft delete (removed user_id condition)
        const sql = `UPDATE notes_master 
                     SET delete_flag = 1, updatetime = NOW() 
                     WHERE note_id = ? AND delete_flag = 0`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result.affectedRows > 0) {
            return response.status(200).json({
                success: true,
                msg: `Note "${noteTitle}" deleted successfully`,
                key: 200,
                data: {
                    id: parseInt(id),
                    title: noteTitle
                }
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to delete note",
            key: 500
        });

    } catch (error) {
        // console.error('Delete Note Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 6. GET NOTES BY CATEGORY - GET /get_notes_by_category/:category
// ============================================
const getNotesByCategory = async (request, response) => {
    try {
        const { category } = request.params;

        const validCategories = ['Personal', 'Work', 'Important', 'Study', 'Other'];
        if (!validCategories.includes(category)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid category. Allowed: Personal, Work, Important, Study, Other",
                key: "category",
                valid_categories: validCategories
            });
        }

        const sql = `SELECT 
                        note_id as id,
                        title,
                        description,
                        category,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime,
                        DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') as updatetime
                     FROM notes_master 
                     WHERE category = ? AND delete_flag = 0
                     ORDER BY createtime DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [category], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return response.status(200).json({
            success: true,
            msg: `Notes for category "${category}" fetched successfully`,
            key: 200,
            data: result,
            total: result.length,
            category: category
        });

    } catch (error) {
        // console.error('Get Notes By Category Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 7. GET NOTES SUMMARY - GET /get_notes_summary
// ============================================
const getNotesSummary = async (request, response) => {
    try {
        const { year, month } = request.query;

        // Get summary (removed user_id condition)
        const summarySql = `SELECT 
                                COUNT(*) as total_notes,
                                COUNT(DISTINCT category) as total_categories,
                                COUNT(CASE WHEN category = 'Personal' THEN 1 END) as personal_count,
                                COUNT(CASE WHEN category = 'Work' THEN 1 END) as work_count,
                                COUNT(CASE WHEN category = 'Important' THEN 1 END) as important_count,
                                COUNT(CASE WHEN category = 'Study' THEN 1 END) as study_count,
                                COUNT(CASE WHEN category = 'Other' THEN 1 END) as other_count,
                                DATE_FORMAT(MAX(createtime), '%Y-%m-%d %H:%i:%s') as last_created
                             FROM notes_master 
                             WHERE delete_flag = 0`;
        
        const summaryResult = await new Promise((resolve, reject) => {
            connection.query(summarySql, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Get category stats (removed user_id condition)
        const categorySql = `SELECT 
                                category,
                                COUNT(*) as count
                             FROM notes_master
                             WHERE delete_flag = 0
                             GROUP BY category
                             ORDER BY count DESC`;
        
        const categoryResult = await new Promise((resolve, reject) => {
            connection.query(categorySql, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        let monthlyStats = null;
        if (year && month) {
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
            
            const monthlySql = `SELECT 
                                    note_id as id,
                                    title,
                                    description,
                                    category,
                                    DATE_FORMAT(date, '%Y-%m-%d') as date,
                                    DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime
                                 FROM notes_master 
                                 WHERE delete_flag = 0
                                 AND date BETWEEN ? AND ?
                                 ORDER BY date DESC`;
            
            const monthlyResult = await new Promise((resolve, reject) => {
                connection.query(monthlySql, [startDate, endDate], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
            
            monthlyStats = {
                month: `${year}-${String(month).padStart(2, '0')}`,
                total: monthlyResult.length,
                notes: monthlyResult
            };
        }

        return response.status(200).json({
            success: true,
            msg: "Notes summary fetched successfully",
            key: 200,
            data: {
                summary: summaryResult[0],
                category_stats: categoryResult,
                monthly_stats: monthlyStats
            }
        });

    } catch (error) {
        // console.error('Get Notes Summary Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 8. GET NOTES BY DATE RANGE - GET /get_notes_by_date_range
// ============================================
const getNotesByDateRange = async (request, response) => {
    try {
        const { start_date, end_date } = request.query;

        if (!start_date) {
            return response.status(400).json({
                success: false,
                msg: "Start date is required",
                key: "start_date"
            });
        }

        if (!end_date) {
            return response.status(400).json({
                success: false,
                msg: "End date is required",
                key: "end_date"
            });
        }

        if (new Date(start_date) > new Date(end_date)) {
            return response.status(400).json({
                success: false,
                msg: "Start date cannot be after end date",
                key: "date_range"
            });
        }

        const sql = `SELECT 
                        note_id as id,
                        title,
                        description,
                        category,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime
                     FROM notes_master 
                     WHERE delete_flag = 0
                     AND date BETWEEN ? AND ?
                     ORDER BY date DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [start_date, end_date], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return response.status(200).json({
            success: true,
            msg: "Notes by date range fetched successfully",
            key: 200,
            data: result,
            total: result.length,
            date_range: {
                start: start_date,
                end: end_date
            }
        });

    } catch (error) {
        // console.error('Get Notes By Date Range Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 9. GET RECENT NOTES - GET /get_recent_notes
// ============================================
const getRecentNotes = async (request, response) => {
    try {
        const { limit = 5 } = request.query;

        const sql = `SELECT 
                        note_id as id,
                        title,
                        description,
                        category,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime
                     FROM notes_master 
                     WHERE delete_flag = 0
                     ORDER BY createtime DESC
                     LIMIT ?`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [parseInt(limit)], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return response.status(200).json({
            success: true,
            msg: "Recent notes fetched successfully",
            key: 200,
            data: result,
            total: result.length,
            limit: parseInt(limit)
        });

    } catch (error) {
        // console.error('Get Recent Notes Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 10. GET CATEGORY STATS - GET /get_category_stats
// ============================================
const getCategoryStats = async (request, response) => {
    try {
        const sql = `SELECT 
                        category,
                        COUNT(*) as count
                     FROM notes_master
                     WHERE delete_flag = 0
                     GROUP BY category
                     ORDER BY count DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Calculate total
        const total = result.reduce((sum, item) => sum + parseInt(item.count), 0);

        return response.status(200).json({
            success: true,
            msg: "Category statistics fetched successfully",
            key: 200,
            data: {
                categories: result,
                total: total
            }
        });

    } catch (error) {
        // console.error('Get Category Stats Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};
// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
module.exports = {
    addNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getNotesByCategory,
    getNotesSummary,
    getNotesByDateRange,
    getRecentNotes,
    getCategoryStats
};