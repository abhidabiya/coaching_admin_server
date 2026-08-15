// Add these imports at the top of your controller file (if not already there)
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const connection = require('../config/connection.js');
const languageMessages = require('./languageMessage.js');

// ============================ COURSE CONTROLLER ============================

const addNewCourse = async (request, response) => {
    try {
        const {
            course_name,
            title,
            description,
            fees,
            minimum_fees,
            maximum_fees,
            duration,
            duration_type = 'months',
            category,
            level = 'all',
            seats_available = 0,
            batch_type = 'regular',
            schedule,
            syllabus,
            requirements,
            meta_title,
            meta_description,
            meta_keywords,
            active = 1,
            featured = 0,
            discount_percentage = 0,
            discount_valid_until = null,
            created_by = 1 // Default admin ID
        } = request.body;

        // Validation
        if (!course_name || !title || !description || !fees || !minimum_fees || !maximum_fees || !duration || !category) {
            return response.status(400).json({
                success: false,
                msg: "Please fill all required fields: course_name, title, description, fees, minimum_fees, maximum_fees, duration, category"
            });
        }

        // Validate numeric fields
        if (isNaN(fees) || parseFloat(fees) < 0) {
            return response.status(400).json({
                success: false,
                msg: "Invalid course fees"
            });
        }
        if (isNaN(minimum_fees) || parseFloat(minimum_fees) < 0) {
            return response.status(400).json({
                success: false,
                msg: "Invalid minimum fees"
            });
        }
        if (isNaN(maximum_fees) || parseFloat(maximum_fees) < 0) {
            return response.status(400).json({
                success: false,
                msg: "Invalid maximum fees"
            });
        }
        if (parseFloat(minimum_fees) > parseFloat(maximum_fees)) {
            return response.status(400).json({
                success: false,
                msg: "Maximum fees should be greater than minimum fees"
            });
        }
        if (duration && isNaN(duration) || parseFloat(duration) <= 0) {
            return response.status(400).json({
                success: false,
                msg: "Invalid duration"
            });
        }

        // Check if course already exists
        const checkQuery = "SELECT course_id FROM courses WHERE course_name = ? AND delete_flag = 0";
        
        connection.query(checkQuery, [course_name], async (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return response.status(500).json({
                    success: false,
                    msg: "Database error",
                    err: err.message
                });
            }

            if (result.length > 0) {
                return response.status(409).json({
                    success: false,
                    msg: "Course with this name already exists"
                });
            }

            // Handle image upload - FIXED: using request.file (not request.files)
            let image_filename = null;
            if (request.file) {
                // Multer already saved the file, just get the filename
                image_filename = request.file.filename;
            } else if (request.files && request.files.image) {
                // Fallback for alternative file upload methods
                const image = request.files.image;
                
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (!allowedTypes.includes(image.mimetype)) {
                    return response.status(400).json({
                        success: false,
                        msg: "Invalid image format. Only JPG, JPEG, PNG, GIF are allowed."
                    });
                }

                if (image.size > maxSize) {
                    return response.status(400).json({
                        success: false,
                        msg: "Image size should not exceed 2MB."
                    });
                }

                // Create upload directory
                const uploadDir = path.join(__dirname, '../../uploads/courses');
                
                // Create directory if it doesn't exist
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const extension = path.extname(image.name);
                image_filename = `course_${timestamp}${extension}`;
                const uploadPath = path.join(uploadDir, image_filename);

                // Save file
                await image.mv(uploadPath);
            }

            // Generate slug
            const slug = course_name.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Prepare SQL query with all fields
            const insertQuery = `
                INSERT INTO courses (
                    course_name, title, description, image, fees, minimum_fees, maximum_fees,
                    duration, duration_type, category, level, seats_available, batch_type,
                    schedule, syllabus, requirements, slug, active, featured, 
                    meta_title, meta_description, meta_keywords, 
                    discount_percentage, discount_valid_until,
                    created_by, createtime
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `;

            const values = [
                course_name,
                title,
                description,
                image_filename,
                parseFloat(fees),
                parseFloat(minimum_fees),
                parseFloat(maximum_fees),
                parseInt(duration),
                duration_type,
                category,
                level,
                parseInt(seats_available),
                batch_type,
                schedule || null,
                syllabus || null,
                requirements || null,
                slug,
                parseInt(active),
                parseInt(featured),
                meta_title || null,
                meta_description || null,
                meta_keywords || null,
                parseFloat(discount_percentage),
                discount_valid_until || null,
                parseInt(created_by)
            ];

            connection.query(insertQuery, values, (err, result) => {
                if (err) {
                    console.error("Insert error:", err);
                    
                    // If there was an error and we uploaded a file, delete it
                    if (image_filename) {
                        const filePath = path.join(__dirname, '../../uploads/courses', image_filename);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                    
                    return response.status(500).json({
                        success: false,
                        msg: "Failed to add course to database",
                        err: err.message
                    });
                }

                return response.status(201).json({
                    success: true,
                    msg: "Course added successfully",
                    course_id: result.insertId,
                    data: {
                        course_id: result.insertId,
                        course_name: course_name,
                        title: title,
                        slug: slug,
                        image: image_filename ? `/uploads/courses/${image_filename}` : null
                    }
                });
            });
        });

    } catch (error) {
        console.error("Unhandled error:", error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message
        });
    }
};


const getAllCourses = async (request, response) => {
    try {
        const { page = 1, limit = 10, search = '', category = '', active = '' } = request.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = `
            SELECT c.*, 
            CONCAT(u.f_name, ' ', u.l_name) as created_by_name
            FROM courses c
            LEFT JOIN user_master u ON c.created_by = u.user_id
            WHERE c.delete_flag = 0
        `;

        let countQuery = `SELECT COUNT(*) as total FROM courses c WHERE c.delete_flag = 0`;
        let conditions = [];
        let values = [];
        let countValues = [];

        // Apply filters
        if (search) {
            conditions.push(`(c.course_name LIKE ? OR c.title LIKE ? OR c.description LIKE ?)`);
            const searchTerm = `%${search}%`;
            values.push(searchTerm, searchTerm, searchTerm);
            countValues.push(searchTerm, searchTerm, searchTerm);
        }

        if (category) {
            conditions.push(`c.category = ?`);
            values.push(category);
            countValues.push(category);
        }

        if (active !== '') {
            conditions.push(`c.active = ?`);
            values.push(parseInt(active));
            countValues.push(parseInt(active));
        }

        if (conditions.length > 0) {
            const whereClause = conditions.join(' AND ');
            query += ` AND ${whereClause}`;
            countQuery += ` AND ${whereClause}`;
        }

        // Sorting
        query += ` ORDER BY c.createtime DESC`;

        // Pagination
        query += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(limit), offset);

        // Execute count query
        connection.query(countQuery, countValues, (err, countResult) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            const total = countResult[0]?.total || 0;

            // Execute main query
            connection.query(query, values, (err, results) => {
                if (err) {
                    return response.status(200).json({
                        success: false,
                        msg: languageMessages.internalServerError,
                        err: err.message
                    });
                }

                var course_arr = [];
                var s_no = (page - 1) * limit;

                if (results.length > 0) {
                    for (var data of results) {
                        s_no++;

                        course_arr.push({
                            s_no: s_no,
                            course_id: data.course_id,
                            course_name: data.course_name,
                            title: data.title,
                            description: data.description,
                            image: data.image,
                            fees: parseFloat(data.fees).toFixed(2),
                            minimum_fees: parseFloat(data.minimum_fees).toFixed(2),
                            maximum_fees: parseFloat(data.maximum_fees).toFixed(2),
                            duration: data.duration,
                            duration_type: data.duration_type,
                            category: data.category,
                            seats_available: data.seats_available,
                            batch_type: data.batch_type,
                            schedule: data.schedule,
                            syllabus: data.syllabus,
                            requirements: data.requirements,
                            active: data.active,
                            featured: data.featured,
                            active_lable: (data.active == 1) ? "Active" : "Inactive",
                            featured_lable: (data.featured == 1) ? "Yes" : "No",
                            created_by_name: data.created_by_name,
                            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
                            updatetime: data.updatetime ? moment(data.updatetime).format("DD-MM-YYYY HH:mm A") : "N/A"
                        });
                    }
                }

                return response.status(200).json({
                    success: true,
                    msg: languageMessages.msgDataFound,
                    data: course_arr,
                    pagination: {
                        total: total,
                        page: parseInt(page),
                        limit: parseInt(limit),
                        pages: Math.ceil(total / parseInt(limit))
                    }
                });
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const getCourseById = async (request, response) => {
    try {
        const { id } = request.params;

        const query = `
            SELECT c.*, 
            CONCAT(u.f_name, ' ', u.l_name) as created_by_name
            FROM courses c
            LEFT JOIN user_master u ON c.created_by = u.user_id
            WHERE c.course_id = ? AND c.delete_flag = 0
        `;

        connection.query(query, [id], (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            if (results.length === 0) {
                return response.status(200).json({
                    success: false,
                    msg: "Course not found"
                });
            }

            const course = results[0];
            
            const course_data = {
                course_id: course.course_id,
                course_name: course.course_name,
                title: course.title,
                description: course.description,
                image: course.image,
                fees: parseFloat(course.fees).toFixed(2),
                minimum_fees: parseFloat(course.minimum_fees).toFixed(2),
                maximum_fees: parseFloat(course.maximum_fees).toFixed(2),
                duration: course.duration,
                duration_type: course.duration_type,
                category: course.category,
                seats_available: course.seats_available,
                batch_type: course.batch_type,
                schedule: course.schedule,
                syllabus: course.syllabus,
                requirements: course.requirements,
                active: course.active,
                featured: course.featured,
                created_by_name: course.created_by_name,
                createtime: moment(course.createtime).format("DD-MM-YYYY HH:mm A"),
                updatetime: course.updatetime ? moment(course.updatetime).format("DD-MM-YYYY HH:mm A") : "N/A"
            };

            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: course_data
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const updateCourse = async (request, response) => {
    try {
        const { id } = request.params;
        const updateData = request.body;

        // Check if course exists
        const checkQuery = "SELECT * FROM courses WHERE course_id = ? AND delete_flag = 0";
        connection.query(checkQuery, [id], (err, result) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            if (result.length === 0) {
                return response.status(200).json({
                    success: false,
                    msg: "Course not found"
                });
            }

            const currentCourse = result[0];
            let image_filename = currentCourse.image;

            // Handle image upload if provided
            if (request.files && request.files.image) {
                const image = request.files.image;
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (!allowedTypes.includes(image.mimetype)) {
                    return response.status(200).json({
                        success: false,
                        msg: "Invalid image format. Only JPG, JPEG, PNG, GIF are allowed."
                    });
                }

                if (image.size > maxSize) {
                    return response.status(200).json({
                        success: false,
                        msg: "Image size should not exceed 2MB."
                    });
                }

                // Delete old image if exists
                if (currentCourse.image) {
                    const oldImagePath = path.join(__dirname, '../../uploads/courses', currentCourse.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                // Create upload directory
                const uploadDir = path.join(__dirname, '../../uploads/courses');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Generate unique filename
                const timestamp = Date.now();
                const extension = path.extname(image.name);
                image_filename = `course_${timestamp}${extension}`;
                const uploadPath = path.join(uploadDir, image_filename);

                // Save file
                image.mv(uploadPath, (err) => {
                    if (err) {
                        return response.status(200).json({
                            success: false,
                            msg: "Failed to save image",
                            err: err.message
                        });
                    }
                });
            }

            // Build update query
            const updateFields = [];
            const values = [];

            // Required fields
            if (updateData.course_name !== undefined) {
                updateFields.push('course_name = ?');
                values.push(updateData.course_name);
            }

            if (updateData.title !== undefined) {
                updateFields.push('title = ?');
                values.push(updateData.title);
            }

            if (updateData.description !== undefined) {
                updateFields.push('description = ?');
                values.push(updateData.description);
            }

            if (updateData.fees !== undefined) {
                updateFields.push('fees = ?');
                values.push(parseFloat(updateData.fees));
            }

            if (updateData.minimum_fees !== undefined) {
                updateFields.push('minimum_fees = ?');
                values.push(parseFloat(updateData.minimum_fees));
            }

            if (updateData.maximum_fees !== undefined) {
                updateFields.push('maximum_fees = ?');
                values.push(parseFloat(updateData.maximum_fees));
            }

            // Optional fields
            if (updateData.duration !== undefined) {
                updateFields.push('duration = ?');
                values.push(updateData.duration);
            }

            if (updateData.duration_type !== undefined) {
                updateFields.push('duration_type = ?');
                values.push(updateData.duration_type);
            }

            if (updateData.category !== undefined) {
                updateFields.push('category = ?');
                values.push(updateData.category);
            }

            if (updateData.active !== undefined) {
                updateFields.push('active = ?');
                values.push(parseInt(updateData.active));
            }

            if (updateData.featured !== undefined) {
                updateFields.push('featured = ?');
                values.push(parseInt(updateData.featured));
            }

            if (request.files && request.files.image) {
                updateFields.push('image = ?');
                values.push(image_filename);
            }

            updateFields.push('updatetime = NOW()');

            if (updateFields.length === 0) {
                return response.status(200).json({
                    success: false,
                    msg: "No fields to update"
                });
            }

            const updateQuery = `UPDATE courses SET ${updateFields.join(', ')} WHERE course_id = ?`;
            values.push(id);

            connection.query(updateQuery, values, (updateErr, updateResult) => {
                if (updateErr) {
                    return response.status(200).json({
                        success: false,
                        msg: languageMessages.internalServerError,
                        err: updateErr.message
                    });
                }

                return response.status(200).json({
                    success: true,
                    msg: "Course updated successfully",
                    course_id: id
                });
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const deleteCourse = async (request, response) => {
    try {
        const { id } = request.params;

        // Soft delete the course
        const deleteQuery = `
            UPDATE courses 
            SET delete_flag = 1, 
                updatetime = NOW() 
            WHERE course_id = ?
        `;

        connection.query(deleteQuery, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: deleteErr.message
                });
            }

            if (deleteResult.affectedRows === 0) {
                return response.status(200).json({
                    success: false,
                    msg: "Course not found"
                });
            }

            return response.status(200).json({
                success: true,
                msg: "Course deleted successfully"
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const toggleCourseStatus = async (request, response) => {
    try {
        const { id } = request.params;
        const { status } = request.body;

        if (status === undefined) {
            return response.status(200).json({
                success: false,
                msg: "Status is required"
            });
        }

        const updateQuery = "UPDATE courses SET active = ?, updatetime = NOW() WHERE course_id = ?";
        
        connection.query(updateQuery, [status ? 1 : 0, id], (err, result) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            if (result.affectedRows === 0) {
                return response.status(200).json({
                    success: false,
                    msg: "Course not found"
                });
            }

            return response.status(200).json({
                success: true,
                msg: `Course ${status ? 'activated' : 'deactivated'} successfully`
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const getCourseCategories = async (request, response) => {
    try {
        const query = `
            SELECT category_id, category_name, description 
            FROM course_categories 
            WHERE active = 1 
            ORDER BY category_name
        `;

        connection.query(query, (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            var category_arr = [];
            var s_no = 0;

            if (results.length > 0) {
                for (var data of results) {
                    s_no++;

                    category_arr.push({
                        s_no: s_no,
                        category_id: data.category_id,
                        category_name: data.category_name,
                        description: data.description
                    });
                }
            }

            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: category_arr
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const addCourseCategory = async (request, response) => {
    try {
        const { category_name, description } = request.body;

        if (!category_name) {
            return response.status(200).json({
                success: false,
                msg: "Category name is required"
            });
        }

        // Check if category already exists
        const checkQuery = "SELECT category_id FROM course_categories WHERE category_name = ?";
        connection.query(checkQuery, [category_name], (err, result) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            if (result.length > 0) {
                return response.status(200).json({
                    success: false,
                    msg: "Category already exists"
                });
            }

            // Insert category
            const insertQuery = `
                INSERT INTO course_categories (category_name, description, createtime)
                VALUES (?, ?, NOW())
            `;

            connection.query(insertQuery, [category_name, description], (insertErr, insertResult) => {
                if (insertErr) {
                    return response.status(200).json({
                        success: false,
                        msg: languageMessages.internalServerError,
                        err: insertErr.message
                    });
                }

                return response.status(200).json({
                    success: true,
                    msg: "Category added successfully",
                    category_id: insertResult.insertId
                });
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const searchCourses = async (request, response) => {
    try {
        const { q } = request.query;

        if (!q || q.trim() === '') {
            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: []
            });
        }

        const searchTerm = `%${q.trim()}%`;
        const query = `
            SELECT course_id, course_name, title, fees, image
            FROM courses
            WHERE delete_flag = 0 
            AND active = 1
            AND (course_name LIKE ? OR title LIKE ?)
            ORDER BY course_name
            LIMIT 10
        `;

        connection.query(query, [searchTerm, searchTerm], (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            var search_arr = [];
            var s_no = 0;

            if (results.length > 0) {
                for (var data of results) {
                    s_no++;

                    search_arr.push({
                        s_no: s_no,
                        course_id: data.course_id,
                        course_name: data.course_name,
                        title: data.title,
                        fees: parseFloat(data.fees).toFixed(2),
                        image: data.image
                    });
                }
            }

            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: search_arr
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const getFeaturedCourses = async (request, response) => {
    try {
        const { limit = 6 } = request.query;

        const query = `
            SELECT course_id, course_name, title, fees, image, description
            FROM courses
            WHERE delete_flag = 0 AND active = 1 AND featured = 1
            ORDER BY createtime DESC
            LIMIT ?
        `;

        connection.query(query, [parseInt(limit)], (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            var featured_arr = [];
            var s_no = 0;

            if (results.length > 0) {
                for (var data of results) {
                    s_no++;

                    featured_arr.push({
                        s_no: s_no,
                        course_id: data.course_id,
                        course_name: data.course_name,
                        title: data.title,
                        fees: parseFloat(data.fees).toFixed(2),
                        image: data.image,
                        description: data.description
                    });
                }
            }

            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: featured_arr
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const getCourseDropdown = async (request, response) => {
    try {
        const query = `
            SELECT course_id, course_name, title, fees 
            FROM courses 
            WHERE delete_flag = 0 AND active = 1 
            ORDER BY course_name
        `;

        connection.query(query, (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            var dropdown_arr = [];
            var s_no = 0;

            if (results.length > 0) {
                for (var data of results) {
                    s_no++;

                    dropdown_arr.push({
                        s_no: s_no,
                        course_id: data.course_id,
                        course_name: data.course_name,
                        title: data.title,
                        fees: parseFloat(data.fees).toFixed(2)
                    });
                }
            }

            return response.status(200).json({
                success: true,
                msg: languageMessages.msgDataFound,
                data: dropdown_arr
            });
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

const getCourseStatistics = async (request, response) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_courses,
                SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_courses,
                SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured_courses,
                AVG(fees) as avg_course_fees,
                MIN(minimum_fees) as min_course_fees,
                MAX(maximum_fees) as max_course_fees,
                SUM(views) as total_views,
                COUNT(DISTINCT category) as unique_categories
            FROM courses 
            WHERE delete_flag = 0
        `;

        connection.query(query, (err, results) => {
            if (err) {
                return response.status(200).json({
                    success: false,
                    msg: languageMessages.internalServerError,
                    err: err.message
                });
            }

            if (results.length > 0) {
                const stats = results[0];
                
                return response.status(200).json({
                    success: true,
                    msg: languageMessages.msgDataFound,
                    data: {
                        total_courses: stats.total_courses || 0,
                        active_courses: stats.active_courses || 0,
                        featured_courses: stats.featured_courses || 0,
                        avg_course_fees: parseFloat(stats.avg_course_fees || 0).toFixed(2),
                        min_course_fees: parseFloat(stats.min_course_fees || 0).toFixed(2),
                        max_course_fees: parseFloat(stats.max_course_fees || 0).toFixed(2),
                        total_views: stats.total_views || 0,
                        unique_categories: stats.unique_categories || 0
                    }
                });
            } else {
                return response.status(200).json({
                    success: true,
                    msg: languageMessages.msgDataFound,
                    data: {
                        total_courses: 0,
                        active_courses: 0,
                        featured_courses: 0,
                        avg_course_fees: 0,
                        min_course_fees: 0,
                        max_course_fees: 0,
                        total_views: 0,
                        unique_categories: 0
                    }
                });
            }
        });

    } catch (error) {
        return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: error.message
        });
    }
};

// ============================ EXPORT ALL FUNCTIONS ============================

module.exports = {
    addNewCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
    getCourseCategories,
    addCourseCategory,
    searchCourses,
    getFeaturedCourses,
    getCourseDropdown,
    getCourseStatistics
};