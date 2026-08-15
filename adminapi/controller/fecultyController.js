// var languageMessages = require("./languageMessage.js");
// var crypto = require("crypto");
// const rs = require("randomstring");
// const jwt = require("jsonwebtoken");
// var moment = require("moment");
// const randomstring = require("randomstring");
// const uniqid = require("uniqid");
// const { request } = require("http");
// const { sourceMapsEnabled } = require("process");
// const { error } = require("console");
const { request, response } = require('express');
const connection = require('../config/connection.js');
// const { response } = require("express");
// const { flushCompileCache } = require("module");

async function hashPassword(pass) {
  return crypto.createHash("md5").update(pass).digest("hex");
}


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
                    msg : "email already",
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
        console.error("Unhandled error:", error);
        return response.status(500).json({
            success: false,
            msg: "Internal server error",
            err: error.message
        });
    }
}

const getallFacultys = async (request , response) => {
    try{
        const sql = `SELECT  feculty_id,   name , email ,mobile , subject , experience , salary , bond  ,qualification    , createtime  , delete_flag FROM feculty_master WHERE   delete_flag = 0   `;
    
        connection.query(sql  , (err , result) => {
            
            if(err){
                return response.status(500).json({
                    success : false ,
                    msg : "data base  error",
                    key : 22,
                    err : err.message
                })
            };
            if(result){
                return response.status(200).json({
                    success : true,
                    msg : "Faculty fetched successfully",
                    key : 55,
                    data : result 
                })
            }
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
        const { id } = request.params;
        const {name , email , mobile  , subject , experience , qualification} = request.body;
        
        if(!name || !email || !mobile ){
            return response.status(500).json({
                success : false ,
                msg : "Please fill all required fields"
            })
        }
        const sql = `UPDATE feculty_master SET name = ? , email =? , mobile = ? ,  subject =? ,  experience = ? , qualification = ?  WHERE feculty_id = ? AND delete_flag = 0 `;

        connection.query(sql , [name , email , mobile || null , subject || null  , experience || null , qualification || null , id] , async (err , result) => {
            if(err){
                return response.status(500).json({
                    success : false,
                    msg : "Database Error"
                })
            }

            if(result.affecteRows > 0){
                return response.status(200).json({
                    success : false,
                    msg : "Faculty not found",
                    key : 5,
                    data : result
                })

            }

            return response.status(200).json({
                success : true,
                msg : "Faculty Update successfully",
                key : 222,
                data : result
            })
        } )


}

const deleteFaculty = async(request , response ) => {

    const {id} = request.params ;
    
    const sql = `DELETE FROM feculty_master WHERE feculty_id = ?  AND delete_flag = 0 `;

    connection.query(sql , [id] ,(err , result) => {

        if(err){
            return response.status(500).json({
                success : false ,
                msg : "data base error",
                err : err.message
            })
        }

        if(result.affecteRows === 0){
            return response.status(400).json({
                success : false ,
                msg : "feculty not found",
            })
        }

        return response.status(201).json({
            success : true,
            msg : "feculty Delete successsfully ",
            key : 5,
        })
    } )
}

const getonedataFaculty = async (request , response) => {
    const  { id} = request.params;

    const sql = `SELECT  feculty_id,    name , email ,mobile, subject , createtime , experience , salary , bond , qualification  FROM feculty_master  WHERE  feculty_id = ? AND delete_flag = 0` ;
   connection.query(sql , [id] , (err , result ) => {

    if(err){
        return response.status(500).json({
            success : false,
            msg : "database error",
            key : 54,
            err : err.message
        })
    }
    if(result.length === 0){
        return response.status(404).json({
            success : false, 
            msg  : "Faculty not found",
        })
    }
    return response.status(200).json({
         success: true,
         msg: "Faculty fetched successfully",
         key: 55,
         data: result[0]
    })

   })
}















// Manage Expence API Section
const addexpense  = async (request , response) => {

    const {category , description , amount ,paymode , receipt_number , remarks  , date} = request.body ; 

    if(!category){
        return response.status(500).json({
            success : false ,
            msg : "category fill"
        })
    }

    if(!description){
        return response.status(500).json({
            success : false ,
            msg : "description fill"
        })
    }if(!amount){
        return response.status(500).json({
            success : false ,
            msg : "amount fill"
        })
    }
    if(!paymode){
        return response.status(500).json({
            success : false ,
            msg : "paymode fill"
        })
    }  

    const  checksql = `SELECT expense_id FROM expense_master  WHERE  receipt_number =? AND delete_flag = 0  `;

    connection.query(checksql , [receipt_number] , (err1 , result1) => {
        if(err1){
            return response.status(500).json({
            success : false,
            msg : "DataBase Error",
            key : 10,
            err : err1.message
        })
        }

        if(result1.length > 0){
            return response.status(400).json({
                success : false , 
                msg : "Receipt number already",
                key : 55,
                data : result1
            })
        }

        const sql = ` INSERT INTO  expense_master (category, description  , amount  , paymode , receipt_number ,remarks ,date , createtime , mysqltime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW() , NOW())`;

    connection.query(sql ,[category , description , amount , paymode  , receipt_number || null , remarks || null, date  ] , (err , result) => {
        if(err){
            return response.status(500).json({
                success : false ,
                msg : "database error",
                key : 22,
                err : err.message
            })
        }

        if(result){
            return response.status(200).json({
                success : true ,
                msg : " Expense add successfully"
            })
        }
    })


    })


    
}

const getallexpense = async(request , response) => {

    const  sql = "SELECT   category, description  , amount  , paymode , receipt_number ,remarks ,date  FROM  expense_master WHERE delete_flag = 0" ;

    connection.query(sql , (err , result) => {
        if(err){
            return response.status(500).json({
                success : false ,
                msg : "database error",
                key : 5,
                err : err.message
            })
        }

        if(result){
            return response.status(200).json({
                success : false ,
                msg : " Expense fetche successfully",
                key : 50,
                data : result
            })
        }
    })
}

const editexpense = async (request , response) => {
    const {id} = request.params
   const  {date  , category , description , amount , paymode ,  receipt_number , remarks } = request.body ;

   if(!category){
        return response.status(500).json({
            success : false ,
            msg : "category fill"
        })
    }

    if(!description){
        return response.status(500).json({
            success : false ,
            msg : "description fill"
        })
    }if(!amount){
        return response.status(500).json({
            success : false ,
            msg : "amount fill"
        })
    }
    if(!paymode){
        return response.status(500).json({
            success : false ,
            msg : "paymode fill"
        })
    }  

    const sql = `UPDATE expense_master SET  date = ? , category =? , description = ? ,amount = ? ,paymode =? , receipt_number =? , remarks =?   WHERE expense_id = ?  AND delete_flag = 0 ` ;

    connection.query(sql, [ date,category,  description,  amount,  paymode,  receipt_number,  remarks ,  id], (err, result) => {
                if (err) {
                    return response.status(500).json({
                        success: false,
                        msg: "Database Error",
                        key: 12,
                        err: err.message
                    });
                }


                
                if (result.affectedRows === 0) {
                    return response.status(404).json({
                        success: false,
                        msg: "Expense not found"
                    });
                }


                
                return response.status(200).json({
                    success: true,
                    msg: "Expense updated successfully",
                    key: 55
                });
    })
}


const deletexpense = async (request , response) => {
    const {id} = request.params;

    const  sql = `DELETE FROM expense_master  WHERE  expense_id = ? AND Delete_flag = 0`;

    connection.query(sql , [id] , (err , result) => {

        if(err){
            return response.status(500).json({
                success : false ,
                msg : "database error ",
                err : err.message
            })
        }

        if(result.affectedRows > 0) {
            return response.status(404).json({
                success : false, 
                msg : "expense found ",
                data : result 
            })
        }

        return response.status(200).json({
            success : true ,
            msg  : "delete expense successsfully",
            key : 30
        })
    })
}

const getoneexpense = async (request , response)=> {
     const {id} = request.params;

     const  sql = `SELECT category ,  description , amount  , paymode , remarks , receipt_number, date  FROM  expense_master WHERE  expense_id  = ? AND delete_flag = 0 `;

     connection.query(sql , [id] , (err , result) => {
        if(err){
            return response.status(500).json({
                success : false ,
                msg : "Database error"
            })
        }
        if(result.length === 0){
            return response.status(401).json({
                suc4 : false,
                msg : "expense found"
            })
        }
        return response.status(200).json({
            success  : true ,
             msg : "expense fetched successfully",
             data  : result[0]
        })
     })
}



module.exports = {Facultyadd ,getallFacultys , editFaculty  , deleteFaculty , getonedataFaculty, addexpense , getallexpense , editexpense , deletexpense , getoneexpense} ;