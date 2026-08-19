var languageMessages = require("./languageMessage.js");
// var crypto = require("crypto");
// const rs = require("randomstring");
// const jwt = require("jsonwebtoken");
var moment = require("moment");
// const randomstring = require("randomstring");
// const uniqid = require("uniqid");
// const { request } = require("http");
// const { sourceMapsEnabled } = require("process");
// const { error } = require("console");
const { request, response } = require('express');
const connection = require('../config/connection.js');
// const { response } = require("express");
// const { flushCompileCache } = require("module");

// async function hashPassword(pass) {
//   return crypto.createHash("md5").update(pass).digest("hex");
// }


// *********************To Add a New Feculty Member***************************

const Facultyadd = async (request , response ) => {

     try{
        const{
            name, 
            email,
            mobile,
            subject,
            experience,
            salary,
            bond,
            qualification,

        } = request.body ;

        if(!name){
            return response.status(400).json({
                success : false ,
                msg : "Name is Missing",
                key: "name"
            });
        }

        if(!email){
            return response.status(400).json({
                success : false ,
                msg : "email is Missing",
                key: "email"
            });
        }

         if(!mobile){
            return response.status(400).json({
                success : false ,
                msg : "mobile is Missing",
                key: "mobile"
            });
        }
         if(!subject){
            return response.status(400).json({
                success : false ,
                msg : "subject is Missing",
                key: "subject"
            });
        }
         if(!experience){
            return response.status(400).json({
                success : false ,
                msg : "experience is Missing",
                key: "experience"
            });
        }
         if(!salary){
            return response.status(400).json({
                success : false ,
                msg : "salary is Missing",
                key: "salary"
            });
        }
         if(!bond){
            return response.status(400).json({
                success : false ,
                msg : "bond is Missing",
                key: "bond"
            });
        }
         if(!qualification){
            return response.status(400).json({
                success : false ,
                msg : "qualification is Missing",
                key: "qualification"
            });
        }
       


        const checksql = "SELECT feculty_id FROM feculty_master WHERE email = ? AND delete_flag = 0";

        connection.query(checksql, [email], async(err, result) => {

            if(err){
                return response.status(500).json({
                    success : false,
                    msg : " data base error",
                    key : err.message

                })
            }
            if(result.length > 0){
                return response.status(409).json({
                    success : false,
                    msg : "email is already Register ",
                    key : 20
                })
            }
             const sql = `INSERT INTO feculty_master (name,email,mobile,subject,experience,salary,bond,qualification, createtime, updatetime )VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
            connection.query(sql , [ name , email , mobile , subject ,experience , salary ,bond || 6 ,  qualification] , async (err , result) => {
                
                if(err){
                    return response.status(500).json({
                        success :   false , 
                        msg  :"Faculty not added",
                        key :  11,
                        err : err.message
                    });
                }
                return response.status(200).json({
                    success : true,
                    msg : "Faculty added successfully", 
                    key : 20,
                    data : result
                })
            })
        } )
     }catch (error) {
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message
        });
    }
}

const getallFacultys = async (request , response) => {
    try{
        const sql = `SELECT  feculty_id,   name , email ,mobile , subject , experience , salary , bond  ,qualification    , createtime  , delete_flag FROM feculty_master WHERE   delete_flag = 0  ORDER By feculty_id DESC  `;
    
        connection.query(sql  , (err , result) => {
            
            if(err){
                return response.status(200).json({
                    success : false ,
                    msg : "data base  error",
                    key : 22,
                    err : err.message
                })
            }

            if(result.length <= 0){
                return response.status(404).json({
                    success : false,
                    msg : "No Faculty Found",
                    key : 5,
                    data : result 
                })
            }
       let feculty_arr = result.map((data, index) => ({

                    s_no: index + 1,
                    feculty_id: data.feculty_id,
                    name: data.name || "Unknown",
                    email: data.email,
                    mobile: data.mobile,
                    subject: data.subject,
                    experience: data.experience,
                    salary: data.salary,
                    feculty_bond: data.bond,
                    qualification: data.qualification,
                    createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
                    }));

               
                return response.status(200).json({
                    success : true,
                    msg : "Faculty Found Successfull",
                    key : "Ok",
                    feculty_arr : feculty_arr || [] 
                })

        })
    }catch (error){
        return response.status(500).json({
            success : false,
            msg : "Internal server error",
            err : error.message
        })
    }
}

const editFaculty = async (request , response) => {
    try{
        const { feculty_id } = request.params;

        const { 

            name, 
            email,
            mobile,
            subject,
            experience,
            salary,
            bond,
            qualification,

         } = request.body;
        
        if(!name){
            return response.status(500).json({
                success : false ,
                msg : "Name is Missing",
            })
        }
         if(!email){
            return response.status(500).json({
                success : false ,
                msg : "email is Missing",
            })
        } if(!mobile){
            return response.status(500).json({
                success : false ,
                msg : "mobile is Missing",
            })
        }
         if(!subject){
            return response.status(500).json({
                success : false ,
                msg : "subject is Missing",
            })
        }
         if(!experience){
            return response.status(500).json({
                success : false ,
                msg : "experience is Missing",
            })
        } 
        if(!qualification){
            return response.status(500).json({
                success : false ,
                msg : "qualification is Missing",
            })
        }

        if(!salary){
            return response.status(500).json({
                success : false ,
                msg : "salary is Missing",
                key: "salary"
            })
        }

        if(!bond){
            return response.status(500).json({
                success : false ,
                msg : "bond is Missing",
                key: "bond"
            })
        }


         const checksql = "SELECT feculty_id, name, email, mobile, subject, experience, salary, bond, qualification FROM feculty_master WHERE email = ? AND delete_flag = 0 AND feculty_id != ?";

        connection.query(checksql, [email, feculty_id], async(err, result) => {

            if(err){
                return response.status(500).json({
                    success : false,
                    msg : " data base error",
                    key : err.message

                })
            }
            if(result.length > 0){
                return response.status(409).json({
                    success : false,
                    msg : "email is already Register ",
                    key : 20
                })
            }
             const sql = `UPDATE feculty_master SET name = ?, email = ? , mobile = ?  , subject = ? ,experience = ? , salary = ? , bond = ? ,  qualification = ? WHERE feculty_id = ?`;
            connection.query(sql , [ name  , email , mobile , subject ,experience , salary ,bond  ,  qualification, feculty_id ] , async (err , result) => {
                
                if(err){
                    return response.status(500).json({
                        success :   false , 
                        msg  :"Faculty not Updated",
                        key :  11,
                        err : err.message
                    });
                }
                return response.status(200).json({
                    success : true,
                    msg : "Faculty Updated successfully", 
                    key : 20,
                    data : result
                })
            })
        } )

    }catch (error){
        return response.status(500).json({
            success : false,
            msg : "Internal server error",
            err : error.message
        })
    }
        

}

const deleteFaculty = async(request , response ) => {
    try{
        const { feculty_id } = request.params ;
    
    const sql = `UPDATE feculty_master SET delete_flag = 1  WHERE feculty_id = ?`;

    connection.query(sql , [feculty_id] ,(err , result) => {

        if(err){
            return response.status(500).json({
                success : false ,
                msg : "Data Base Error",
                err : err.message
            })
        }
             return response.status(201).json({
            success : true,
            msg : "Feculty Delete successsfully ",
            key : result,
        })
    } )
        
    }catch (error){
        return response.status(500).json({
            success : false,
            msg : "Internal server error",
            err : error.message
        })
    }
}

const getonedataFaculty = async (request , response) => {
    try{
        const  { feculty_id } = request.params;

    const sql = `SELECT  feculty_id,    name , email ,mobile, subject , createtime , experience , salary , bond , qualification  FROM feculty_master  WHERE  feculty_id = ? AND delete_flag = 0` ;
   connection.query(sql , [feculty_id] , (err , result ) => {

    if(err){
        return response.status(500).json({
            success : false,
            msg : "database error",
            key : 54,
            err : err.message
        })
    }
    if(result.length == 0){
        return response.status(404).json({
            success : false, 
            msg  : "Faculty not found",
        })
    }
   let feculty_arr = result.map((data, index) => ({

                    s_no: index + 1,
                    feculty_id: data.feculty_id,
                    name: data.name || "Unknown",
                    email: data.email,
                    mobile: data.mobile,
                    subject: data.subject,
                    experience: data.experience,
                    salary: data.salary,
                    feculty_bond: data.bond,
                    qualification: data.qualification,
                    createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
                    }));
     return response.status(200).json({
         success: true,
         msg: "Faculty fetched successfully",
         key: 55,
         data: feculty_arr || []
    })

   })
    }catch (error){
        return response.status(500).json({
            success : false,
            msg : "Internal server error",
            err : error.message,
            key : "error"
        })
    }
    
}




// ============================================
// 1. ADD EXPENSE - POST /add_expense
// ============================================
const addexpense = async (request, response) => {
    try {
        const { 
            category, 
            description, 
            amount, 
            paymode, 
            receipt_number, 
            remarks, 
            date 
        } = request.body;

        // Validation
        if (!category) {
            return response.status(400).json({
                success: false,
                msg: "Category is required",
                key: "category"
            });
        }

        if (!description) {
            return response.status(400).json({
                success: false,
                msg: "Description is required",
                key: "description"
            });
        }

        if (!amount) {
            return response.status(400).json({
                success: false,
                msg: "Amount is required",
                key: "amount"
            });
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return response.status(400).json({
                success: false,
                msg: "Please enter a valid amount",
                key: "amount"
            });
        }

        if (!date) {
            return response.status(400).json({
                success: false,
                msg: "Date is required",
                key: "date"
            });
        }

        // Check for duplicate receipt number
        if (receipt_number) {
            const checksql = `SELECT expense_id FROM expense_master WHERE receipt_number = ? AND delete_flag = 0`;
            
            const checkResult = await new Promise((resolve, reject) => {
                connection.query(checksql, [receipt_number], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            if (checkResult.length > 0) {
                return response.status(409).json({
                    success: false,
                    msg: "Receipt number already exists",
                    key: 55
                });
            }
        }

        // Insert expense
        const sql = `INSERT INTO expense_master 
                     (category, description, amount, paymode, receipt_number, remarks, date, createtime, mysqltime) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                sql,
                [
                    category,
                    description,
                    parseFloat(amount),
                    paymode || 'Cash',
                    receipt_number || null,
                    remarks || null,
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
            const getSql = `SELECT * FROM expense_master WHERE expense_id = ?`;
            const insertedData = await new Promise((resolve, reject) => {
                connection.query(getSql, [result.insertId], (err, data) => {
                    if (err) reject(err);
                    else resolve(data[0]);
                });
            });

            return response.status(201).json({
                success: true,
                msg: "Expense added successfully",
                key: 200,
                data: insertedData
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to add expense",
            key: 500
        });

    } catch (error) {
        console.error('Add Expense Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 2. GET ALL EXPENSES - GET /get_all_expense
// ============================================
const getallexpense = async (request, response) => {
    try {
        const sql = `SELECT 
                        expense_id,
                        category,
                        description,
                        amount,
                        paymode,
                        receipt_number,
                        remarks,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime
                     FROM expense_master 
                     WHERE delete_flag = 0 
                     ORDER BY expense_id DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result && result.length > 0) {
            return response.status(200).json({
                success: true,
                msg: "Expenses fetched successfully",
                key: 200,
                data: result,
                total: result.length
            });
        }

        return response.status(200).json({
            success: true,
            msg: "No expenses found",
            key: 200,
            data: [],
            total: 0
        });

    } catch (error) {
        console.error('Get All Expenses Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 3. GET SINGLE EXPENSE - GET /getonexpense/:id
// ============================================
const getonexpense = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid expense ID",
                key: 400
            });
        }

        const sql = `SELECT 
                        expense_id,
                        category,
                        description,
                        amount,
                        paymode,
                        receipt_number,
                        remarks,
                        DATE_FORMAT(date, '%Y-%m-%d') as date,
                        DATE_FORMAT(createtime, '%Y-%m-%d %H:%i:%s') as createtime
                     FROM expense_master 
                     WHERE expense_id = ? AND delete_flag = 0`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result && result.length > 0) {
            return response.status(200).json({
                success: true,
                msg: "Expense fetched successfully",
                key: 200,
                data: result[0]
            });
        }

        return response.status(404).json({
            success: false,
            msg: "Expense not found",
            key: 404,
            data: null
        });

    } catch (error) {
        console.error('Get Single Expense Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 4. UPDATE EXPENSE - PUT /edit_expense/:id
// ============================================
const editexpense = async (request, response) => {
    try {
        const { id } = request.params;
        const { 
            date, 
            category, 
            description, 
            amount, 
            paymode, 
            receipt_number, 
            remarks 
        } = request.body;

        // Validation
        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid expense ID",
                key: 400
            });
        }

        if (!category) {
            return response.status(400).json({
                success: false,
                msg: "Category is required",
                key: "category"
            });
        }

        if (!description) {
            return response.status(400).json({
                success: false,
                msg: "Description is required",
                key: "description"
            });
        }

        if (!amount) {
            return response.status(400).json({
                success: false,
                msg: "Amount is required",
                key: "amount"
            });
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return response.status(400).json({
                success: false,
                msg: "Please enter a valid amount",
                key: "amount"
            });
        }

        if (!date) {
            return response.status(400).json({
                success: false,
                msg: "Date is required",
                key: "date"
            });
        }

        // Check if expense exists
        const checkSql = `SELECT expense_id FROM expense_master WHERE expense_id = ? AND delete_flag = 0`;
        const checkResult = await new Promise((resolve, reject) => {
            connection.query(checkSql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!checkResult || checkResult.length === 0) {
            return response.status(404).json({
                success: false,
                msg: "Expense not found",
                key: 404
            });
        }

        // Check duplicate receipt number (excluding current expense)
        if (receipt_number) {
            const duplicateSql = `SELECT expense_id FROM expense_master 
                                  WHERE receipt_number = ? AND expense_id != ? AND delete_flag = 0`;
            const duplicateResult = await new Promise((resolve, reject) => {
                connection.query(duplicateSql, [receipt_number, id], (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            if (duplicateResult.length > 0) {
                return response.status(409).json({
                    success: false,
                    msg: "Receipt number already exists",
                    key: 55
                });
            }
        }

        // Update expense
        const sql = `UPDATE expense_master 
                     SET date = ?,
                         category = ?,
                         description = ?,
                         amount = ?,
                         paymode = ?,
                         receipt_number = ?,
                         remarks = ?,
                         mysqltime = NOW()
                     WHERE expense_id = ? AND delete_flag = 0`;

        const result = await new Promise((resolve, reject) => {
            connection.query(
                sql,
                [
                    date,
                    category,
                    description,
                    parseFloat(amount),
                    paymode || 'Cash',
                    receipt_number || null,
                    remarks || null,
                    id
                ],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });

        if (result && result.affectedRows > 0) {
            // Fetch updated record
            const getSql = `SELECT * FROM expense_master WHERE expense_id = ?`;
            const updatedData = await new Promise((resolve, reject) => {
                connection.query(getSql, [id], (err, data) => {
                    if (err) reject(err);
                    else resolve(data[0]);
                });
            });

            return response.status(200).json({
                success: true,
                msg: "Expense updated successfully",
                key: 200,
                data: updatedData
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to update expense",
            key: 500
        });

    } catch (error) {
        console.error('Update Expense Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 5. DELETE EXPENSE - DELETE /deletexpense/:id
// ============================================
const deletexpense = async (request, response) => {
    try {
        const { id } = request.params;

        if (!id || isNaN(id)) {
            return response.status(400).json({
                success: false,
                msg: "Invalid expense ID",
                key: 400
            });
        }

        // Check if expense exists
        const checkSql = `SELECT expense_id FROM expense_master WHERE expense_id = ? AND delete_flag = 0`;
        const checkResult = await new Promise((resolve, reject) => {
            connection.query(checkSql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!checkResult || checkResult.length === 0) {
            return response.status(404).json({
                success: false,
                msg: "Expense not found",
                key: 404
            });
        }

        // Soft delete (update delete_flag)
        const sql = `UPDATE expense_master SET delete_flag = 1, mysqltime = NOW() WHERE expense_id = ?`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (result && result.affectedRows > 0) {
            return response.status(200).json({
                success: true,
                msg: "Expense deleted successfully",
                key: 200,
                data: { deleted_id: id }
            });
        }

        return response.status(500).json({
            success: false,
            msg: "Failed to delete expense",
            key: 500
        });

    } catch (error) {
        console.error('Delete Expense Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 6. GET EXPENSES BY DATE RANGE - GET /get_expenses_by_date
// ============================================
const getExpensesByDateRange = async (request, response) => {
    try {
        const { start_date, end_date } = request.query;

        if (!start_date || !end_date) {
            return response.status(400).json({
                success: false,
                msg: "Start date and end date are required",
                key: 400
            });
        }

        const sql = `SELECT 
                        expense_id,
                        category,
                        description,
                        amount,
                        paymode,
                        receipt_number,
                        remarks,
                        DATE_FORMAT(date, '%Y-%m-%d') as date
                     FROM expense_master 
                     WHERE delete_flag = 0 
                     AND date BETWEEN ? AND ?
                     ORDER BY date DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [start_date, end_date], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Calculate summary
        const total = result.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const categorySummary = {};
        
        result.forEach(item => {
            if (categorySummary[item.category]) {
                categorySummary[item.category] += parseFloat(item.amount);
            } else {
                categorySummary[item.category] = parseFloat(item.amount);
            }
        });

        return response.status(200).json({
            success: true,
            msg: "Expenses fetched successfully",
            key: 200,
            data: result,
            summary: {
                total: total,
                count: result.length,
                category_wise: categorySummary
            }
        });

    } catch (error) {
        console.error('Get Expenses By Date Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 7. GET EXPENSES SUMMARY - GET /get_expenses_summary
// ============================================
const getExpensesSummary = async (request, response) => {
    try {
        const { year, month } = request.query;

        let whereClause = "delete_flag = 0";
        let params = [];

        if (year) {
            whereClause += " AND YEAR(date) = ?";
            params.push(year);
        }

        if (month) {
            whereClause += " AND MONTH(date) = ?";
            params.push(month);
        }

        // Total expenses
        const totalSql = `SELECT 
                            COUNT(*) as total_count,
                            SUM(amount) as total_amount,
                            AVG(amount) as avg_amount,
                            MIN(amount) as min_amount,
                            MAX(amount) as max_amount
                          FROM expense_master 
                          WHERE ${whereClause}`;

        const totalResult = await new Promise((resolve, reject) => {
            connection.query(totalSql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result[0]);
            });
        });

        // Category-wise summary
        const categorySql = `SELECT 
                                category,
                                COUNT(*) as count,
                                SUM(amount) as total_amount,
                                AVG(amount) as avg_amount
                             FROM expense_master 
                             WHERE ${whereClause}
                             GROUP BY category
                             ORDER BY total_amount DESC`;

        const categoryResult = await new Promise((resolve, reject) => {
            connection.query(categorySql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Monthly summary (if no year/month filter)
        let monthlyData = [];
        if (!year && !month) {
            const monthlySql = `SELECT 
                                    YEAR(date) as year,
                                    MONTH(date) as month,
                                    MONTHNAME(date) as month_name,
                                    COUNT(*) as count,
                                    SUM(amount) as total_amount
                                FROM expense_master 
                                WHERE delete_flag = 0
                                GROUP BY YEAR(date), MONTH(date)
                                ORDER BY YEAR(date) DESC, MONTH(date) DESC
                                LIMIT 12`;

            monthlyData = await new Promise((resolve, reject) => {
                connection.query(monthlySql, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }

        return response.status(200).json({
            success: true,
            msg: "Summary fetched successfully",
            key: 200,
            data: {
                total: totalResult,
                category_wise: categoryResult,
                monthly: monthlyData
            }
        });

    } catch (error) {
        console.error('Get Expenses Summary Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};

// ============================================
// 8. GET EXPENSES BY CATEGORY - GET /get_expenses_by_category/:category
// ============================================
const getExpensesByCategory = async (request, response) => {
    try {
        const { category } = request.params;
        const { start_date, end_date } = request.query;

        if (!category) {
            return response.status(400).json({
                success: false,
                msg: "Category is required",
                key: 400
            });
        }

        let whereClause = "delete_flag = 0 AND category = ?";
        let params = [category];

        if (start_date && end_date) {
            whereClause += " AND date BETWEEN ? AND ?";
            params.push(start_date, end_date);
        }

        const sql = `SELECT 
                        expense_id,
                        description,
                        amount,
                        paymode,
                        receipt_number,
                        remarks,
                        DATE_FORMAT(date, '%Y-%m-%d') as date
                     FROM expense_master 
                     WHERE ${whereClause}
                     ORDER BY date DESC`;

        const result = await new Promise((resolve, reject) => {
            connection.query(sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const total = result.reduce((sum, item) => sum + parseFloat(item.amount), 0);

        return response.status(200).json({
            success: true,
            msg: `Expenses for category '${category}' fetched successfully`,
            key: 200,
            data: result,
            summary: {
                category: category,
                total: total,
                count: result.length
            }
        });

    } catch (error) {
        console.error('Get Expenses By Category Error:', error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message,
            key: 500
        });
    }
};


module.exports = {Facultyadd ,getallFacultys , editFaculty  , deleteFaculty , getonedataFaculty, 

    addexpense,
    getallexpense,
    getonexpense,
    editexpense,
    deletexpense,
    getExpensesByDateRange,
    getExpensesSummary,
    getExpensesByCategory



} ;