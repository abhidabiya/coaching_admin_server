// Add these imports at the top of your control
// ler file (if not already there)
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const connection = require('../config/connection.js');

const languageMessages = require('./languageMessage.js');


// Create Student Admission / Enquiry
// const createStudentRecord = (req, res) => {
//     try {
//         const {
//             admission_type, // 0 = enquiry, 1 = admission
//             name,
//             address,
//             contact_number,
//             parent_contact,
//             date_of_birth,
//             qualification,
//             course_name,
//             date_of_admission,
//             total_fees,
//             fees_submitted,
//             enquiry_type,
//             preferred_timing,
//             registration_fee,
//             payment_mode,
//             payment_date,
//             batch_timing,
//             enquiry_source,
//             reference_by,
//             email,
//             gender,
//             zipcode,
//             added_by
//         } = req.body;

//         // 🔹 Basic validation
//         if (!name || !contact_number || !course_name) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Name, contact number, and course name are required'
//             });
//         }

//         // 🔹 Parse numbers safely
//         const admissionType = Number(admission_type);
//         const feesAmount = Number(total_fees) || 0;
//         const feesSubmitted = Number(fees_submitted) || 0;
//         const regFee = Number(registration_fee) || 0;
//         const feesPending = feesAmount - feesSubmitted;

//         // 🔹 Determine user_type & student_status
//         let user_type;
//         let student_status;

//         if (admissionType === 0) {
//             user_type = 5; // enquiry
//             student_status = 0; // enquiry_pending
//         } else {
//             user_type = 6; // admitted student
//             student_status = 3; // active
//         }

//         // 🔹 Admission step logic
//         let admission_step = 0;
//         if (regFee > 0 && feesSubmitted >= regFee) {
//             admission_step = 1;
//         }

//         // 🔹 SQL Query
//         const sql = `
//             INSERT INTO user_master SET
//                 user_type = ?,
//                 admission_type = ?,
//                 f_name = ?,
//                 name = ?,
//                 address = ?,
//                 mobile = ?,
//                 parent_contact = ?,
//                 dob = ?,
//                 qualification = ?,
//                 course_name = ?,
//                 date_of_admission = ?,
//                 total_fees = ?,
//                 fees_submitted = ?,
//                 fees_pending = ?,
//                 enquiry_type = ?,
//                 preferred_timing = ?,
//                 registration_fee = ?,
//                 payment_mode = ?,
//                 payment_date = ?,
//                 student_status = ?,
//                 admission_step = ?,
//                 batch_timing = ?,
//                 enquiry_source = ?,
//                 reference_by = ?,
//                 email = ?,
//                 gender = ?,
//                 zipcode = ?,
//                 added_by = ?,
//                 active_flag = 1,
//                 delete_flag = 0,
//                 createtime = NOW(),
//                 updatetime = NOW()
//         `;

//         const values = [
//             user_type,
//             admissionType,
//             name,
//             name,
//             address,
//             contact_number,
//             parent_contact,
//             date_of_birth,
//             qualification,
//             course_name,
//             date_of_admission,
//             feesAmount,
//             feesSubmitted,
//             feesPending,
//             enquiry_type,
//             preferred_timing,
//             regFee,
//             payment_mode,
//             payment_date,
//             student_status,
//             admission_step,
//             batch_timing,
//             enquiry_source,
//             reference_by,
//             email,
//             gender,
//             zipcode,
//             added_by || 0
//         ];

//         // 🔹 Execute query (CALLBACK STYLE — FIXES YOUR ERROR)
//         connection.query(sql, values, (err, result) => {
//             if (err) {
//                 console.error('DB Error:', err);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Server error',
//                     error: err.message
//                 });
//             }

//             return res.status(201).json({
//                 success: true,
//                 message: admissionType === 0
//                     ? 'Enquiry created successfully'
//                     : 'Admission created successfully',
//                 data: {
//                     user_id: result.insertId,
//                     student_status,
//                     fees_pending: feesPending
//                 }
//             });
//         });

//     } catch (error) {
//         console.error('API Error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Server error',
//             error: error.message
//         });
//     }
// };

const createStudentRecord = (req, res) => {
    try {
        const {
            admission_type = 1,
            name,
            address = null,
            contact_number,
            parent_contact = null,
            date_of_birth = null,
            qualification = null,
            course_name,
            date_of_admission = null,
            total_fees = 0,
            fees_submitted = 0,
            enquiry_type = null,
            preferred_timing = null,
            registration_fee = 0,
            payment_mode = null,
            payment_date = null,
            batch_timing = null,
            enquiry_source = null,
            reference_by = null,
            email = null,
            gender = null,
            zipcode = null,
            added_by = 0
        } = req.body;

        /*
        |--------------------------------------------------------------------------
        | Basic validation
        |--------------------------------------------------------------------------
        */

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        if (!contact_number || !String(contact_number).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Contact number is required'
            });
        }

        if (!course_name || !String(course_name).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Course name is required'
            });
        }

        const admissionType = Number(admission_type);

        if (![0, 1].includes(admissionType)) {
            return res.status(400).json({
                success: false,
                message: 'admission_type must be 0 or 1'
            });
        }

        const mobile = String(contact_number).trim();

        if (!/^[0-9]{10}$/.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Contact number must contain exactly 10 digits'
            });
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Name handling
        |--------------------------------------------------------------------------
        */

        const fullName = String(name).trim();
        const nameParts = fullName.split(/\s+/);

        const firstName = nameParts[0] || fullName;
        const lastName = nameParts.slice(1).join(' ') || null;

        /*
        |--------------------------------------------------------------------------
        | Fees calculation
        |--------------------------------------------------------------------------
        */

        const totalFees = Number(total_fees) || 0;
        const feesSubmittedInput = Number(fees_submitted) || 0;
        const registrationFee = Number(registration_fee) || 0;

        if (totalFees < 0 || feesSubmittedInput < 0 || registrationFee < 0) {
            return res.status(400).json({
                success: false,
                message: 'Fees cannot be negative'
            });
        }

        /*
         * For enquiry:
         * registration_fee is treated as the total payable amount.
         *
         * For admission:
         * total_fees and fees_submitted are used.
         */
        let finalTotalFees;
        let finalFeesSubmitted;

        if (admissionType === 0) {
            finalTotalFees = registrationFee;
            finalFeesSubmitted = feesSubmittedInput;

            if (finalFeesSubmitted > finalTotalFees) {
                return res.status(400).json({
                    success: false,
                    message: 'Submitted fees cannot exceed registration fee'
                });
            }
        } else {
            finalTotalFees = totalFees;
            finalFeesSubmitted = feesSubmittedInput;

            if (finalFeesSubmitted > finalTotalFees) {
                return res.status(400).json({
                    success: false,
                    message: 'Submitted fees cannot exceed total fees'
                });
            }
        }

        const feesPending = Math.max(
            finalTotalFees - finalFeesSubmitted,
            0
        );

        /*
        |--------------------------------------------------------------------------
        | Student type and status
        |--------------------------------------------------------------------------
        */

        const userType = admissionType === 0 ? 5 : 6;

        // 0 = enquiry pending
        // 3 = active admitted student
        const studentStatus = admissionType === 0 ? 0 : 3;

        /*
        |--------------------------------------------------------------------------
        | Admission step
        |--------------------------------------------------------------------------
        */

        let admissionStep = 0;

        if (admissionType === 0) {
            // Enquiry registration fee paid
            if (
                registrationFee > 0 &&
                finalFeesSubmitted >= registrationFee
            ) {
                admissionStep = 1;
            }
        } else {
            // Admission created
            if (finalFeesSubmitted > 0) {
                admissionStep = 2;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Insert query
        |--------------------------------------------------------------------------
        */

        const sql = `
            INSERT INTO user_master (
                user_type,
                admission_type,
                f_name,
                l_name,
                name,
                address,
                mobile,
                parent_contact,
                dob,
                qualification,
                course_name,
                date_of_admission,
                total_fees,
                fees_submitted,
                fees_pending,
                enquiry_type,
                preferred_timing,
                registration_fee,
                payment_mode,
                payment_date,
                student_status,
                admission_step,
                batch_timing,
                enquiry_source,
                reference_by,
                email,
                gender,
                zipcode,
                active_flag,
                approve_flag,
                delete_flag,
                added_by,
                createtime,
                updatetime
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
            )
        `;

        const values = [
            userType,              // user_type
            admissionType,         // admission_type
            firstName,             // f_name
            lastName,              // l_name
            fullName,              // name
            address,               // address
            mobile,                // mobile
            parent_contact,        // parent_contact
            date_of_birth,         // dob
            qualification,         // qualification
            course_name,           // course_name
            admissionType === 1
                ? date_of_admission
                : null,            // date_of_admission
            finalTotalFees,        // total_fees
            finalFeesSubmitted,   // fees_submitted
            feesPending,           // fees_pending
            enquiry_type,          // enquiry_type
            preferred_timing,      // preferred_timing
            registrationFee,       // registration_fee
            payment_mode,          // payment_mode
            payment_date,          // payment_date
            studentStatus,         // student_status
            admissionStep,         // admission_step
            batch_timing,          // batch_timing
            enquiry_source,        // enquiry_source
            reference_by,          // reference_by
            email,                 // email
            gender,                // gender
            zipcode,               // zipcode
            1,                     // active_flag
            1,                     // approve_flag
            0,                     // delete_flag
            Number(added_by) || 0  // added_by
        ];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('createStudentRecord DB Error:', err);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to create student record',
                    error: err.message
                });
            }

            return res.status(201).json({
                success: true,
                message:
                    admissionType === 0
                        ? 'Enquiry created successfully'
                        : 'Admission created successfully',
                data: {
                    user_id: result.insertId,
                    user_type: userType,
                    admission_type: admissionType,
                    student_status: studentStatus,
                    admission_step: admissionStep,
                    total_fees: finalTotalFees,
                    fees_submitted: finalFeesSubmitted,
                    fees_pending: feesPending
                }
            });
        });
    } catch (error) {
        console.error('createStudentRecord API Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};



// ✅ 2. Get All Users with Student Data
const getAllUsers = (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            search = '',
            type
        } = req.query;

        const offset = (page - 1) * limit;
        let whereClause = `WHERE delete_flag = 0`;
        const params = [];

        // 🔹 Filter by type
        if (type === 'students') {
            whereClause += ` AND user_type IN (5,6)`;
        } else if (type === 'enquiries') {
            whereClause += ` AND user_type = 5`;
        } else if (type === 'admissions') {
            whereClause += ` AND user_type = 6`;
        }

        // 🔍 Search
        if (search) {
            whereClause += `
                AND (
                    name LIKE ? OR 
                    email LIKE ? OR 
                    mobile LIKE ? OR
                    course_name LIKE ? OR
                    qualification LIKE ? OR
                    parent_contact LIKE ?
                )
            `;
            const searchValue = `%${search}%`;
            params.push(
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue,
                searchValue
            );
        }

        // 🔢 Total count
        const countSql = `
            SELECT COUNT(*) AS total
            FROM user_master
            ${whereClause}
        `;

        connection.query(countSql, params, (countErr, countResult) => {
            if (countErr) {
                return res.status(500).json({
                    success: false,
                    message: 'Count error',
                    error: countErr.message
                });
            }

            const total = countResult[0].total;

            // 📄 Data query
            const dataSql = `
                SELECT
                    user_id,
                    user_type,
                    admission_type,
                    f_name,
                    l_name,
                    name,
                    email,
                    mobile,
                    parent_contact,
                    address,
                    dob,
                    qualification,
                    course_name,
                    date_of_admission,
                    total_fees,
                    fees_submitted,
                    fees_pending,
                    enquiry_type,
                    preferred_timing,
                    registration_fee,
                    payment_mode,
                    payment_date,
                    student_status,
                    admission_step,
                    batch_timing,
                    enquiry_source,
                    reference_by,
                    gender,
                    zipcode,
                    active_flag,
                    
                    user_side,
                    delete_flag,
                    DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') AS createtime,
                    DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') AS updatetime
                FROM user_master
                ${whereClause}
                ORDER BY createtime DESC
                LIMIT ? OFFSET ?
            `;

            connection.query(
                dataSql,
                [...params, Number(limit), Number(offset)],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Query error',
                            error: err.message
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        data: results,
                        pagination: {
                            total,
                            page: Number(page),
                            limit: Number(limit),
                            totalPages: Math.ceil(total / limit)
                        }
                    });
                }
            );
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ✅ 3. Get Single User/Student by ID
 const getUserById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }

    const sql = `
        SELECT 
            user_id,
            user_type,
            admission_type,
            f_name,
            l_name,
            name,
            email,
            mobile,
            parent_contact,
            address,
            dob,
            qualification,
            course_name,
            date_of_admission,
            total_fees,
            fees_submitted,
            fees_pending,
            enquiry_type,
            preferred_timing,
            registration_fee,
            payment_mode,
            payment_date,
            student_status,
            admission_step,
            batch_timing,
            enquiry_source,
            reference_by,
            gender,
            zipcode,
            active_flag,
            user_side,
            delete_flag,
            DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') AS createtime,
            DATE_FORMAT(updatetime, '%Y-%m-%d %H:%i:%s') AS updatetime
        FROM user_master
        WHERE user_id = ? AND delete_flag = 0
        LIMIT 1
    `;

    connection.query(sql, [id], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    });
};


// ✅ 4. Update User/Student Record
 const updateStudentRecord = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'User ID required' });
    }

    const allowedFields = {
        name: 'name',
        f_name: 'f_name',
        address: 'address',
        mobile: 'mobile',
        parent_contact: 'parent_contact',
        dob: 'dob',
        qualification: 'qualification',
        course_name: 'course_name',
        date_of_admission: 'date_of_admission',
        total_fees: 'total_fees',
        fees_submitted: 'fees_submitted',
        enquiry_type: 'enquiry_type',
        preferred_timing: 'preferred_timing',
        registration_fee: 'registration_fee',
        payment_mode: 'payment_mode',
        payment_date: 'payment_date',
        student_status: 'student_status',
        admission_step: 'admission_step',
        batch_timing: 'batch_timing',
        enquiry_source: 'enquiry_source',
        reference_by: 'reference_by',
        email: 'email',
        gender: 'gender',
        zipcode: 'zipcode',
        active_flag: 'active_flag'
    };

    const fields = [];
    const values = [];

    Object.keys(allowedFields).forEach(key => {
        if (data[key] !== undefined) {
            fields.push(`${allowedFields[key]} = ?`);
            values.push(data[key]);
        }
    });

    if (!fields.length) {
        return res.status(400).json({
            success: false,
            message: 'No valid fields to update'
        });
    }

    // Handle fees_pending calculation
    const feeSql = `
        SELECT total_fees, fees_submitted 
        FROM user_master WHERE user_id = ?
    `;

    connection.query(feeSql, [id], (feeErr, feeRows) => {
        if (feeErr || !feeRows.length) {
            return res.status(500).json({ success: false, message: 'Fee fetch error' });
        }

        const totalFees = data.total_fees ?? feeRows[0].total_fees ?? 0;
        const submitted = data.fees_submitted ?? feeRows[0].fees_submitted ?? 0;
        const pending = Number(totalFees) - Number(submitted);

        fields.push('fees_pending = ?', 'updatetime = NOW()');
        values.push(pending, id);

        const sql = `UPDATE user_master SET ${fields.join(', ')} WHERE user_id = ?`;

        connection.query(sql, values, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: err.message });
            }

            res.json({
                success: true,
                message: 'Record updated successfully',
                fees_pending: pending
            });
        });
    });
};


// ✅ 5. Convert Enquiry to Admission
 const convertEnquiryToAdmission = (req, res) => {
    const { id } = req.params;
    const {
        date_of_admission,
        total_fees = 0,
        fees_submitted = 0,
        qualification,
        payment_mode,
        payment_date,
        batch_timing
    } = req.body;

    const checkSql = `
        SELECT user_type 
        FROM user_master 
        WHERE user_id = ? AND delete_flag = 0
    `;

    connection.query(checkSql, [id], (err, rows) => {
        if (err || !rows.length) {
            return res.status(404).json({ success: false, message: 'Enquiry not found' });
        }

        if (rows[0].user_type !== 5) {
            return res.status(400).json({
                success: false,
                message: 'Only enquiries can be converted'
            });
        }

        const pending = Number(total_fees) - Number(fees_submitted);

        const sql = `
            UPDATE user_master SET
                user_type = 6,
                admission_type = 1,
                date_of_admission = ?,
                total_fees = ?,
                fees_submitted = ?,
                fees_pending = ?,
                qualification = ?,
                payment_mode = ?,
                payment_date = ?,
                batch_timing = ?,
                student_status = 3,
                admission_step = 2,
                updatetime = NOW()
            WHERE user_id = ?
        `;

        connection.query(sql, [
            date_of_admission,
            total_fees,
            fees_submitted,
            pending,
            qualification,
            payment_mode,
            payment_date,
            batch_timing,
            id
        ], () => {
            res.json({
                success: true,
                message: 'Enquiry converted to admission'
            });
        });
    });
};


// ✅ 6. Delete User (Soft Delete)
 const deleteUser = (req, res) => {
    const { id } = req.params;
    const { delete_reason } = req.body;

    if (!delete_reason) {
        return res.status(400).json({
            success: false,
            message: 'Delete reason required'
        });
    }

    const sql = `
        UPDATE user_master
        SET delete_flag = 1,
            delete_reason = ?,
            active_flag = 0,
            updatetime = NOW()
        WHERE user_id = ? AND delete_flag = 0
    `;

    connection.query(sql, [delete_reason, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    });
};


// ✅ 7. Activate/Deactivate User (for non-student users)
 const activateDeactivateUser = (req, res) => {
    const { user_id, parkomStatus, gatepassStatus } = req.body;

    const sql = `
        UPDATE user_master SET
            parkom_active_flag = COALESCE(?, parkom_active_flag),
            gatepass_active_flag = COALESCE(?, gatepass_active_flag),
            updatetime = NOW()
        WHERE user_id = ?
    `;

    connection.query(sql, [parkomStatus, gatepassStatus, user_id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        res.json({ success: true, message: 'User status updated' });
    });
};


// ✅ 8. Get Student Statistics
 const getStudentStatistics = (req, res) => {
    const sql = `
        SELECT
            SUM(user_type = 5) AS total_enquiries,
            SUM(user_type = 6) AS total_admissions,
            SUM(user_type = 5 AND student_status = 0) AS pending_enquiries,
            SUM(user_type = 6 AND student_status = 3) AS active_admissions,
            SUM(user_type = 6 AND student_status = 4) AS completed_admissions,
            SUM(user_type = 6 AND student_status = 5) AS discontinued_admissions,
            SUM(CASE WHEN user_type = 6 THEN total_fees ELSE 0 END) AS total_fees,
            SUM(CASE WHEN user_type = 6 THEN fees_pending ELSE 0 END) AS total_pending
        FROM user_master
        WHERE delete_flag = 0
    `;

    connection.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: rows[0] });
    });
};


// ✅ 9. Get Courses List (for dropdown)
const getCoursesList = (req, res) => {
    try {
        const sql = `
            SELECT DISTINCT course_name 
            FROM user_master 
            WHERE course_name IS NOT NULL AND course_name != '' 
            AND delete_flag = 0
            ORDER BY course_name
        `;

        connection.query(sql, (err, results) => {
            if (err) {
                console.error('DB Error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error: err.message
                });
            }

            return res.status(200).json({
                success: true,
                data: results
            });
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// ✅ 10. Update Follow-up Information
 const updateFollowup = (req, res) => {
    const { id } = req.params;
    const { followup_date, next_followup, followup_notes } = req.body;

    const sql = `
        UPDATE user_master
        SET followup_date = ?,
            next_followup = ?,
            followup_notes = ?,
            updatetime = NOW()
        WHERE user_id = ? AND delete_flag = 0
    `;

    connection.query(sql, [followup_date, next_followup, followup_notes, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        if (!result.affectedRows) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Follow-up updated successfully' });
    });
};


module.exports = {
    createStudentRecord,
    getAllUsers,
    getUserById,
    updateStudentRecord,
    convertEnquiryToAdmission,
    deleteUser,
    activateDeactivateUser,
    getStudentStatistics,
    getCoursesList,
    updateFollowup
};










