var connection = require("../config/connection");

var languageMessages = require("./languageMessage");

var crypto = require("crypto");

const rs = require("randomstring");

const jwt = require("jsonwebtoken");

var moment = require("moment");

const randomstring = require("randomstring");

const uniqid = require("uniqid");

// const logoIMage = require("../../logo/logo.jpg");

const {
  mailBodyContactUs,
  sendMail,
  ForgetPasswordMail,
  mailBodyForgetPassword,
  mailBodyActivateDeactivateUser,
  ActivateDeactivateMailUser,
  mailBodyNewGuardAdd,
  NewGuardAddEmail,

  SocietyPasswordMail,
  mailBodySocietyPasswordMail,
  mailBodyGuardPasswordMail,
  GuardPasswordMail,
  SocietyForgetPasswordMail,
  SocietymailBodyForgetPassword

} = require("./mailer");
const { request } = require("http");
const { sourceMapsEnabled } = require("process");
const { error } = require("console");


async function hashPassword(pass) {
  return crypto.createHash("md5").update(pass).digest("hex");
}

const getUserTotalCount = (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT count(user_id) as user_count FROM user_master WHERE delete_flag = 0 AND user_type != 0 AND user_type != 2 AND user_type != 3 AND otp_verify = 1 AND profile_completed = 1";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (userResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }
    });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
};


const getGuardTotalCount = async(request, response) => {
  try{
    const sqlcheckGuard = "SELECT count(user_id) as guard_count FROM user_master WHERE delete_flag = 0 AND user_type = 2";
    connection.query(sqlcheckGuard, async (err, guardResult) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,

        })
      }

      if (guardResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (guardResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          guardResult: guardResult,
        });
      }

    })

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: "Catch",
    });
  }
}


const getBuildingTotalCount = async(request, response) => {
  try{
    const sqlcheckGuard = "SELECT count(building_id) as building_count FROM building_master WHERE delete_flag = 0";
    connection.query(sqlcheckGuard, async (err, guardResult) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,

        })
      }

      if (guardResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (guardResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          guardResult: guardResult,
        });
      }

    })

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: "Catch",
    });
  }
}



const getCategoryTotalCount = (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT count(business_id) as category_count FROM business_master WHERE delete_flag = 0";

    connection.query(sqlCheckUser, async (err, categoryResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      if (categoryResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          categoryResult: categoryResult,
        });
      }

      if (categoryResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          categoryResult: categoryResult,
        });
      }
    });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
};

const getAllUserDataController = async (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT user_id, user_side, login_type, parkom_active_flag, gatepass_active_flag, user_type, f_name, l_name, username,name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender,notification_status, instagram_id, createtime, updatetime FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND user_type != 3 AND user_type != 2 AND otp_verify = 1 order by user_id desc";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            user_side: data.user_side,

            username: data.username,

            f_name: data.f_name,

            parkom_active_flag: data.parkom_active_flag,

            gatepass_active_flag: data.gatepass_active_flag,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            user_type : data.user_type,

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            user_type_lable : "0=admin 1=user 2=customer",

            active_flag_lable: (data.active_flag === 1) ? "Active" : "Deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};


const getAllParkomUser = async (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT user_id, login_type, user_type, user_side, f_name, l_name, username,name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender,notification_status, instagram_id, createtime, updatetime , parkom_active_flag, gatepass_active_flag  FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND otp_verify = 1 AND user_side = 1 order by user_id desc";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            user_side: data.user_side,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,
            parkom_active_flag: data.parkom_active_flag,
            gatepass_active_flag : data.gatepass_active_flag ,

            user_type : data.user_type,

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            user_type_lable : "0=admin 1=user 2=customer",

            active_flag_lable: (data.active_flag === 1) ? "Active" : "Deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};


const getAllBothParkomandGatepassUser = async (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT user_id, login_type, user_type, user_side, f_name, l_name, username,name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender,notification_status, instagram_id, createtime, updatetime FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND otp_verify = 1 AND user_side = 3 order by user_id desc";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            user_side: data.user_side,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            user_type : data.user_type,

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            user_type_lable : "0=admin 1=user 2=customer",

            active_flag_lable: (data.active_flag === 1) ? "Active" : "Deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};



const getAllGatePassUser = async (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT user_id, login_type, user_type, user_side, f_name, l_name, username,name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender,notification_status, instagram_id, createtime, updatetime, parkom_active_flag, gatepass_active_flag  FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND otp_verify = 1 AND user_side = 2 order by user_id desc";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            user_side: data.user_side,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,
            gatepass_active_flag : data.gatepass_active_flag ,
            parkom_active_flag: data.parkom_active_flag,

            user_type : data.user_type,

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            user_type_lable : "0=admin 1=user 2=customer",

            active_flag_lable: (data.active_flag === 1) ? "Active" : "Deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};





const getAllDeletedUser = async (request, response) => {
  try {
    const sqlCheckUser =
      "SELECT user_id, login_type, user_type, f_name, l_name, name, username, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender,notification_status,delete_reason, instagram_id, createtime, updatetime FROM user_master WHERE delete_flag = 1 AND user_type = 1 order by user_id desc";

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            email: data.email,

            name : data.name,

            image: data.image,

            // address: data.address,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            delete_reason: data.delete_reason,

            active_flag: data.active_flag,
            
            active_flag_lable: (data.active_flag === 1) ? "active" : "deactive",

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            createtime: moment(data.updatetime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};



const AdminForgetPassword = async (request, response) => {

  const { email } = request.body;

  if (!email) {
    return response.status(200).json({
      success: false,
      msg: "Email is required.",
    });
  }

  try {
    // Query to fetch admin details by email
    const sql =
      "SELECT user_id, username, email FROM user_master WHERE email = ? AND user_type = 0 AND delete_flag = 0";

    connection.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return response.status(200).json({
          success: false,
          msg: "Database error occurred.",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return response.status(200).json({
          success: false,
          msg: "User not found for given email.",
          key: "email",
        });
      }

      const adminEmail = results[0].email;
      const adminName = results[0].username;
      const userId = results[0].user_id;
  
      // Set expiration time (15 minutes from now)
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

      // Update expiration_time field in the database
      const updateSql = "UPDATE user_master SET expiration_time = ? WHERE email = ?";
      connection.query(updateSql, [expirationTime, email], async (updateErr) => {
        if (updateErr) {
          console.error("Error updating expiration time:", updateErr);
          return response.status(200).json({
            success: false,
            msg: "Failed to update expiration time.",
            error: updateErr.message,
          });
        }
   
        const uniqcode = uniqid(); // Generate unique identifier
        const md5Hash = crypto.createHash("md5").update(uniqcode).digest("hex");

        // Create reset link
        const resetLink = `https://meribhiapp.com/2024/parkom/admin/resetpassword?uniqcode=${md5Hash}`;

        connection.query(
          "INSERT INTO forgot_password_master (user_id, user_type, email, forgot_pass_identity, active_flag, createtime, updatetime) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [ userId, 0, adminEmail, md5Hash, 0],
          async (error) => {
            if (error) {
              return res.status(500).json({
                success: false,
                msg: languageMessage.internalServerError,
              });
            }
         
        // Generate email bodyAdminForgetNewPassword
        const subject = "Forgot Password";
        const app_name = "Parkom";
        const app_logo =
          "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
          // http://localhost:3003/2026/parkom/server/

        const mailBody = mailBodyForgetPassword({
          adminName,
          adminEmail,
          subject,
          app_logo,
          app_name,
          resetLink, // Include reset link in email
        });

        // Send forget password email
        try {
          const mailRes = await ForgetPasswordMail(adminEmail, subject, mailBody);

          if (mailRes.success) {
            return response.status(200).json({
              success: true,
              msg: "Forget password email sent successfully.",
              user_id: userId,
            });
          } else {
            return response.status(200).json({
              success: false,
              msg: "Failed to send forget password email.",
              error: mailRes.error,
            });
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return response.status(200).json({
            success: false,
            msg: "Error sending forget password email.",
            error: emailError.message,
          });
        }
      });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return response.status(200).json({
      success: false,
      msg: "Unexpected error occurred.",
      error: error.message,
    });
  }
};



const adminForgetNewPassword = async (request, response) => {
  const { newPassword, md5Hash } = request.body;

  // Validate required fields
  if (!md5Hash || !newPassword) {
    return response.status(400).json({
      success: false,
      msg: "Missing parameters: md5Hash or newPassword.",
      key: "password",
    });
  }

  try {
    const hashedPassword = await hashPassword(newPassword);

    // Step 1: Check if the forgot password entry exists and is still valid
    connection.query(
      "SELECT forgot_id, user_id FROM forgot_password_master WHERE active_flag = 0 AND forgot_pass_identity = ?",
      [md5Hash],
      (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return response.status(500).json({
            success: false,
            msg: "Database error occurred.",
          });
        }

        if (!results || results.length === 0) {
          return response.status(404).json({
            success: false,
            msg: "Invalid or expired reset link.",
          });
        }

        const userId = results[0].user_id;

        // Step 2: Update the user's password
        connection.query(
          "UPDATE user_master SET password = ?, updatetime = ? WHERE user_id = ?",
          [hashedPassword, new Date(), userId],
          (updateError, updateResults) => {
            if (updateError) {
              console.error("Error updating user password:", updateError);
              return response.status(500).json({
                success: false,
                msg: "Failed to update password.",
              });
            }

            if (updateResults.affectedRows === 0) {
              return response.status(500).json({
                success: false,
                msg: "User not found or password update failed.",
              });
            }

            // Step 3: Mark the reset request as used
            connection.query(
              "UPDATE forgot_password_master SET active_flag = 1, updatetime = ? WHERE forgot_pass_identity = ?",
              [new Date(), md5Hash],
              (updateForgotError) => {
                if (updateForgotError) {
                  console.error(
                    "Error updating forgot password record:",
                    updateForgotError
                  );
                  return response.status(500).json({
                    success: false,
                    msg: "Failed to update forgot password record.",
                  });
                }

                return response.status(200).json({
                  success: true,
                  msg: "Password updated successfully.",
                });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return response.status(500).json({
      success: false,
      msg: "An unexpected error occurred.",
      error: err.message,
    });
  }
};


const ViewUserDetails = async (request, response) => {
 
  const { user_id } = request.params;
  
  if (!user_id) {
    return response.status(200).json({
      success: false,

      msg: languageMessages.msg_empty_param,

      key: "hey",
    });
  }

  var checkUser = "SELECT user_id FROM user_master WHERE user_id = ?";

  connection.query(checkUser, [user_id], async (err, res) => {
    if (err) {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.internalServerError });
    }
   
    if (res.length <= 0) {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.msgUserNotFound });
    }

    // if (res[0].active_flag === 0) {
    //   return response

    //     .status(200)

    //     .json({ success: false, msg: languageMessages.accountdeactivated });
    // }

    if (res.length > 0) {
      var FetchDetails = `
 SELECT 
        u.user_id,u.username, u.f_name, u.l_name, u.name, u.user_side,u.society_name as society_name2, u.shift, u.password, u.location, u.mobile, u.email, u.image, u.latitude, u.longitude, u.active_flag, u.user_type, u.parkom_active_flag, u.gatepass_active_flag, u.createtime,
        b.building_name,
        c.society_name
      FROM user_master u
      LEFT JOIN building_master b ON u.building_id = b.building_id
      LEFT JOIN society_master c ON u.society_id = c.society_id
      WHERE u.user_id = ?;

      `

      connection.query(FetchDetails, [user_id], async (err, userResult) => {
        if (err) {
          return response

            .status(200)

            .json({
              success: false,
              msg: languageMessages.internalServerError,
            });
        } else {
        
          if (userResult.length > 0) {
            var user_arr = [];

            // for (var data of userResult) {

            var data = userResult[0];

            // s_no++;

            user_arr.push({
              // s_no: s_no,

              user_id: data.user_id,

              username: data.username,
              
              name: data.name,

              f_name: data.f_name,

              l_name: data.l_name,

              user_side: data.user_side,

              name: data.name,

              shift: data.shift,

              password: data.password,
              
              location: data.location,

              mobile: data.mobile,

              building_name: data.building_name,

              society_name2: data.society_name,
              
              society_name: data.society_name2,

              email: data.email,

              image: data.image,

              latitude: data.latitude,

              longitude: data.longitude,

              mobile: data.mobile,

              active_flag: data.active_flag,

              user_type : data.user_type,
              
              parkom_active_flag : data.parkom_active_flag,

              gatepass_active_flag : data.gatepass_active_flag,

              // business_name : data.business_name,

              // business_id : (data.business_id != 0) ? await getBusinesName(data.business_id) : data.business_category_name,

              // user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

              createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
              
            });
            return response.status(200).json({success: true,msg: languageMessages.msgDataFound,res: user_arr});
          }
        }
      });
    } else {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.msgUserNotFound });
    }
  });
};



const ViewSocietyDetails = async (request, response) => {
 
  const { user_id } = request.params;
  
  if (!user_id) {
    return response.status(200).json({
      success: false,

      msg: languageMessages.msg_empty_param,

      key: "hey",
    });
  }

  var checkUser = "SELECT user_id FROM user_master WHERE user_id = ?";

  connection.query(checkUser, [user_id], async (err, res) => {
    if (err) {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.internalServerError });
    }
   
    if (res.length <= 0) {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.msgUserNotFound });
    }

   
    if (res.length > 0) {
      var FetchDetails = `
 SELECT * FROM user_master WHERE user_type = 3 AND delete_flag = 0

      `

      connection.query(FetchDetails, [user_id], async (err, userResult) => {
        if (err) {
          return response

            .status(200)

            .json({
              success: false,
              msg: languageMessages.internalServerError,
            });
        } else {
        
          if (userResult.length > 0) {
            var user_arr = [];

            // for (var data of userResult) {

            var data = userResult[0];

            // s_no++;

            user_arr.push({
              // s_no: s_no,

              user_id: data.user_id,

              username: data.username,

              f_name: data.f_name,

              location: data.location,


              l_name: data.l_name,

              user_side: data.user_side,

              name: data.name,

              role: data.role,

              password: data.password,

              mobile: data.mobile,

              building_name: data.building_name,

              society_name: data.society_name,

              email: data.email,

              image: data.image,

              latitude: data.latitude,

              longitude: data.longitude,

              mobile: data.mobile,

              active_flag: data.active_flag,

              user_type : data.user_type,
              
              parkom_active_flag : data.parkom_active_flag,

              gatepass_active_flag : data.gatepass_active_flag,

              // business_name : data.business_name,

              // business_id : (data.business_id != 0) ? await getBusinesName(data.business_id) : data.business_category_name,

              // user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

              createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
              
            });
            return response.status(200).json({success: true,msg: languageMessages.msgDataFound,res: user_arr});
          }
        }
      });
    } else {
      return response

        .status(200)

        .json({ success: false, msg: languageMessages.msgUserNotFound });
    }
  });
};




async function getBusinesName(business_id) {
  return new Promise((resolve,reject) => {
    var sqlSelect = "SELECT business_id, name FROM business_master WHERE business_id = ? AND delete_flag = 0";
    connection.query(sqlSelect,[business_id],async (err,result) => {
      if(err) {
        reject(err.message);
      }
      resolve(result.length > 0 ? result[0].name : "NA");
    })
  })
}

//Old Code
// const ActivateDeactivateUser = async (request, response) => {
//   let { user_id, parkomStatus, gatepassStatus } = request.body;

//   if (user_id === undefined) {
//     return response.status(200).json({ success: false, msg: "Missing user_id" });
//   }

//   if (parkomStatus === undefined) {
//     return response.status(200).json({ success: false, msg: "Missing parkomStatus" });
//   }

//   if (gatepassStatus === undefined) {
//     return response.status(200).json({ success: false, msg: "Missing gatepassStatus" });
//   }

//   try {
//     // Check if user exists
//     const checkUserQuery = "SELECT * FROM user_master WHERE user_id = ? AND delete_flag = 0";

//     connection.query(checkUserQuery, [user_id], async (err, res) => {
//       if (err) {
//         console.error("Error querying database:", err);
//         return response.status(200).json({ success: false, msg: "Internal server error", key: "1" });
//       }

//       if (res.length === 0) {
//         return response.status(200).json({ success: false, msg: "User not found" });
//       }

//       const user = res[0];
//       const userName = `${user.f_name} ${user.l_name}`;
//       const userEmail = user.email;

//       // Ensure that values are numbers (0 or 1)
//       parkomStatus = Number(parkomStatus);
//       gatepassStatus = Number(gatepassStatus);

//       // Determine new active_flag: 1 if any is active, else 0
//       const newActiveFlag = parkomStatus === 1 || gatepassStatus === 1 ? 1 : 0;

//       // Update user record
//       const updateUserQuery = `
//         UPDATE user_master 
//         SET active_flag = ?, parkom_active_flag = ?, gatepass_active_flag = ? 
//         WHERE user_id = ?
//       `;

//       connection.query(updateUserQuery, [newActiveFlag, parkomStatus, gatepassStatus, user_id], async (err, result) => {
//         if (err) {
//           console.error("Error updating user:", err);
//           return response.status(200).json({ success: false, msg: "Internal server error", key: "2" });
//         }

//         if (result.affectedRows > 0) {
//           const subject = "Account Info";
//           const app_name = process.env.APP_NAME;
//           const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
//           const newStatusMsg = newActiveFlag === 1 ? "Activated" : "Deactivated";

//           const mailBody = mailBodyActivateDeactivateUser({ userName, newStatusMsg, app_name, app_logo });

//           try {
//             const mailResponse = await ActivateDeactivateMailUser(userEmail, subject, mailBody);

//             if (mailResponse.success) {
//               return response.status(200).json({ success: true, msg: languageMessages.EmailSent });
//             } else {
//               return response.status(200).json({ success: false, msg: "Error sending email" });
//             }
//           } catch (error) {
//             console.error("Error sending email:", error);
//             return response.status(200).json({ success: false, msg: "Failed to send email" });
//           }
//         } else {
//           return response.status(200).json({ success: false, msg: "Failed to update user status" });
//         }
//       });
//     });
//   } catch (error) {
//     console.error("Caught exception:", error);
//     return response.status(200).json({ success: false, msg: "Internal server error", key: "3" });
//   }
// };

// const ActivateDeactivateUser = async (request, response) => {
//   let { user_id, parkomStatus, gatepassStatus } = request.body;

//   if (user_id === undefined) {
//       return response.status(200).json({ success: false, msg: "Missing user_id" });
//   }

//   try {
//       // Check if user exists
//       const checkUserQuery = "SELECT * FROM user_master WHERE user_id = ? AND delete_flag = 0";

//       connection.query(checkUserQuery, [user_id], async (err, res) => {
//           if (err) {
//               console.error("Error querying database:", err);
//               return response.status(200).json({ success: false, msg: "Internal server error", key: "1" });
//           }

//           if (res.length === 0) {
//               return response.status(200).json({ success: false, msg: "User not found" });
//           }

//           const user = res[0];
//           const userSide = user.user_side; // 1: Parkom, 2: Gatepass, 3: Both

//           // Ensure that values are numbers (0 or 1)
//           parkomStatus = Number(parkomStatus);
//           gatepassStatus = Number(gatepassStatus);

//           // Determine new active_flag based on user type
//           let newActiveFlag;
//           if (userSide === 1) {
//               // Parkom User: Only update parkom_active_flag
//               newActiveFlag = parkomStatus;
//           } else if (userSide === 2) {
//               // Gatepass User: Only update gatepass_active_flag
//               newActiveFlag = gatepassStatus;
//           } else if (userSide === 3) {
//               // Both User: Update both flags and set active_flag if either is active
//               newActiveFlag = parkomStatus === 1 || gatepassStatus === 1 ? 1 : 0;
//           }

//           // Update user record
//           const updateUserQuery = `
//               UPDATE user_master 
//               SET 
//                   active_flag = ?, 
//                   ${userSide === 1 ? "parkom_active_flag = ?" : ""}
//                   ${userSide === 2 ? "gatepass_active_flag = ?" : ""}
//                   ${userSide === 3 ? "parkom_active_flag = ?, gatepass_active_flag = ?" : ""}
//               WHERE user_id = ?
//           `;

//           const queryParams = [newActiveFlag];
//           if (userSide === 1) {
//               queryParams.push(parkomStatus);
//           } else if (userSide === 2) {
//               queryParams.push(gatepassStatus);
//           } else if (userSide === 3) {
//               queryParams.push(parkomStatus, gatepassStatus);
//           }
//           queryParams.push(user_id);

//           connection.query(updateUserQuery, queryParams, async (err, result) => {
//               if (err) {
//                   console.error("Error updating user:", err);
//                   return response.status(200).json({ success: false, msg: "Internal server error", key: "2" });
//               }

//               if (result.affectedRows > 0) {
//                   const subject = "Account Info";
//                   const app_name = process.env.APP_NAME;
//                   const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
//                   const newStatusMsg = newActiveFlag === 1 ? "Activated" : "Deactivated";

//                   const mailBody = mailBodyActivateDeactivateUser({ userName: `${user.f_name} ${user.l_name}`, newStatusMsg, app_name, app_logo });

//                   try {
//                       const mailResponse = await ActivateDeactivateMailUser(user.email, subject, mailBody);

//                       if (mailResponse.success) {
//                           return response.status(200).json({ success: true, msg: "User status updated successfully" });
//                       } else {
//                           return response.status(200).json({ success: false, msg: "Error sending email" });
//                       }
//                   } catch (error) {
//                       console.error("Error sending email:", error);
//                       return response.status(200).json({ success: false, msg: "Failed to send email" });
//                   }
//               } else {
//                   return response.status(200).json({ success: false, msg: "Failed to update user status" });
//               }
//           });
//       });
//   } catch (error) {
//       console.error("Caught exception:", error);
//       return response.status(200).json({ success: false, msg: "Internal server error", key: "3" });
//   }
// };



const ActivateDeactivateUser = async (request, response) => {
  let { user_id, parkomStatus, gatepassStatus } = request.body;

  if (user_id === undefined) {
    return response.status(200).json({ success: false, msg: "Missing user_id" });
  }

  try {
    // Check if user exists
    const checkUserQuery = "SELECT * FROM user_master WHERE user_id = ? AND delete_flag = 0";

    connection.query(checkUserQuery, [user_id], async (err, res) => {
      if (err) {
        console.error("Error querying database:", err);
        return response.status(200).json({ success: false, msg: "Internal server error", key: "1" });
      }

      if (res.length === 0) {
        return response.status(200).json({ success: false, msg: "User not found" });
      }

      const user = res[0];
      const userSide = user.user_side; // 1: Parkom, 2: Gatepass, 3: Both

      parkomStatus = Number(parkomStatus);
      gatepassStatus = Number(gatepassStatus);

      let newActiveFlag;
      let updateFields = [];
      let queryParams = [];

      if (userSide === 1) {
        newActiveFlag = parkomStatus;
        updateFields.push("parkom_active_flag = ?");
        queryParams.push(parkomStatus);
      } else if (userSide === 2) {
        newActiveFlag = gatepassStatus;
        updateFields.push("gatepass_active_flag = ?");
        queryParams.push(gatepassStatus);
      } else if (userSide === 3) {
        newActiveFlag = parkomStatus === 1 || gatepassStatus === 1 ? 1 : 0;
        updateFields.push("parkom_active_flag = ?", "gatepass_active_flag = ?");
        queryParams.push(parkomStatus, gatepassStatus);
      }

      if (userSide === 3) {
        updateFields.push("active_flag = ?");
        queryParams.push(newActiveFlag);
      }

      const updateUserQuery = `
        UPDATE user_master 
        SET ${updateFields.join(", ")}
        WHERE user_id = ?
      `;

      queryParams.push(user_id);

      // Execute the UPDATE query
      connection.query(updateUserQuery, queryParams, async (err, result) => {
        if (err) {
          console.error("Error updating user:", err);
          return response.status(200).json({ success: false, msg: "Internal server error", key: "2",err });
        }

        if (result.affectedRows > 0) {
          const subject = "Account Info";
          const app_name = process.env.APP_NAME;
          const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
          const newStatusMsg = newActiveFlag === 1 ? "Activated" : "Deactivated";

          const mailBody = mailBodyActivateDeactivateUser({ userName: `${user.f_name} ${user.l_name}`, newStatusMsg, app_name, app_logo });

          try {
            const mailResponse = await ActivateDeactivateMailUser(user.email, subject, mailBody);

            if (mailResponse.success) {
              return response.status(200).json({ success: true, msg: "User status updated successfully" });
            } else {
              return response.status(200).json({ success: false, msg: "Error sending email" });
            }
          } catch (error) {
            console.error("Error sending email:", error);
            return response.status(200).json({ success: false, msg: "Failed to send email" });
          }
        } else {
          return response.status(200).json({ success: false, msg: "Failed to update user status" });
        }
      });
    });
  } catch (error) {
    console.error("Caught exception:", error);
    return response.status(200).json({ success: false, msg: "Internal server error", key: "3" });
  }
};


//Activate Deactivate

//Delete user

const DeleteUser = async (request, response) => {
  const data = request.body;

  const { user_id } = data;

  // console.log(data);

  // console.log(user_id);

  if (!user_id) {
    return response

      .status(200)

      .json({ success: false, msg: languageMessages.msg_empty_param });
  }

  try {
    const checkUserQuery =
      "SELECT * FROM user_master WHERE user_id = ? AND delete_flag = 0";

    connection.query(checkUserQuery, [user_id], async (err, res) => {
      if (err) {
        console.error("Error querying database:", err);

        return response

          .status(200)

          .json({ success: false, msg: languageMessages.internalServerError });
      }

      if (res.length === 0) {
        return response

          .status(200)

          .json({ success: false, msg: languageMessages.msgUserNotFound });
      }

      const user = res[0];

      // if (user.active_flag === 0) {

      //   return response

      //     .status(200)

      //     .json({ success: false, msg: languageMessages.accountdeactivated });

      // }

      const updateUserQuery =
        "UPDATE user_master SET delete_flag = 1 WHERE user_id = ?";

      connection.query(updateUserQuery, [user_id], async (err) => {
        if (err) {
          console.error("Error updating user:", err);

          return response

            .status(200)

            .json({
              success: false,
              msg: languageMessages.internalServerError,
            });
        } else {
          return response

            .status(200)

            .json({ success: true, msg: languageMessages.AccountDeleted });
        }
      });
    });
  } catch (error) {
    console.error("Caught exception : ", error);

    return response

      .status(200)

      .json({ success: false, msg: languageMessages.internalServerError });
  }
};

//Fetch Delete user

const getAllCategory = async (request, response) => {
  try {
    var sqlSelect =
      "SELECT business_id, name, icon, delete_flag, createtime, updatetime, mysqltime FROM business_master WHERE delete_flag = 0 order by business_id desc";

    connection.query(sqlSelect, async (err, result) => {
      if (err) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgDataFound });
      }

      var s_no = 0;

      var category_arr = [];

      for (var data of result) {
        s_no++;

        category_arr.push({
          s_no: s_no,

          category_id: data.business_id,

          category_name: data.name,

          // image: data.image,

          createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
        });
      }

      // Return the processed array with serial numbers

      return response.status(200).json({
        success: true,
        msg: languageMessages.msgDataFound,
        result: category_arr,
      });
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};


const addCategory  = async (request, response) => {
  const { category_name } = request.body;

  if (!category_name) {
    return response.status(400).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "category_name",
    });
  }

  try {
    const CheckBanner = "SELECT category_id FROM category_master WHERE delete_flag = 0 AND LOWER(category_name) = LOWER(?);";
    
    connection.query(CheckBanner, [category_name], (err, res) => {
      if (err) {
        return response.status(500).json({
          success: false,
          msg: languageMessages.internalServerError,
          error: err.message,
        });
      }

      if (res.length > 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.BannerExist,
          key: "categoryExists",
        });
      }

      const Insert = "INSERT INTO category_master(category_name, createtime, updatetime) VALUES (?, NOW(), NOW())";

      connection.query(Insert, [category_name], (err, insertRes) => {
        if (err) {
          return response.status(500).json({
            success: false,
            msg: languageMessages.internalServerError,
            error: err.message,
          });
        }

        const newCategory = {
          category_id: insertRes.insertId, 
          category_name,
          createtime: new Date().toISOString(),
        };

        return response.status(201).json({
          success: true,
          msg: languageMessages.categoryAdded,
          newCategory,
        });
      });
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    });
  }
};
const deleteCategory  = async (request, response) => {
    const { category_id } = request.body;
    try {
      if (!category_id) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msg_empty_param,
          key: "category_id",
        });
      }
      
      var sqlDelete =
            "update category_master set delete_flag = 1 , updatetime = now() where category_id = ?";
          connection.query(sqlDelete, [category_id], (err, resultCatgory) => {
            if (err) {
              return response.status(200).json({
                success: false,
                msg: languageMessages.internalServerError,
                error: err.message,
              });
            }
            if (resultCatgory.affectedRows <= 0) {
              return response
                .status(200)
                .json({ success: false, msg: "Error updating business category" });
            }
            if (resultCatgory.affectedRows > 0) {
              return response
                .status(200)
                .json({ success: true, msg: languageMessages.deleteCatgory });
            }
          });
      
    } catch (error) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.internalServerError,
        error: error.message,
      });
    }
  };
  
  
  
const editCategory = async (request, response) => {
  const { category_id, category_name } = request.body;

  try {
    if (!category_id) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "category_id",
      });
    }
    if (!category_name) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "category_name",
      });
    }

    const checkCategory =
      "SELECT category_id FROM category_master WHERE  category_id = ? AND delete_flag = 0";
    connection.query(checkCategory, [category_id], (err, res) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          key: "1",
        });
      }
      if (res.length === 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataNotFound,
          key: "categoryNotFound",
        });
      }


      const checkDuplicateName =
      "SELECT category_id FROM category_master WHERE delete_flag = 0 AND LOWER(category_name) = LOWER(?) AND category_id != ? AND delete_flag = 0";
      connection.query(
        checkDuplicateName,
        [category_name, category_id],
        (duplicateErr, duplicateRes) => {
          if (duplicateErr) {
            return response.status(200).json({
              success: false,
              msg: languageMessages.internalServerError,
              key: "2",
            });
          }
          if (duplicateRes.length > 0) {
            return response.status(200).json({
              success: false,
              msg: languageMessages.msgDataFound,
              key: "categoryExist",
            });
          }

          const updateCategory =
            "UPDATE category_master SET category_name = ? WHERE category_id = ? AND delete_flag = 0";
          connection.query(
            updateCategory,
            [category_name, category_id],
            (updateError, result) => {
              if (updateError) {
                return response.status(200).json({
                  success: false,
                  msg: languageMessages.internalServerError,
                  error : updateError.message,
                  key: "3",
                });
              }
              if (result.affectedRows <= 0) {
                return response.status(200).json({
                  success: false,
                  msg: languageMessages.errorUpdating,
                });
              }

              return response.status(200).json({
                success: true,
                msg: languageMessages.DetailsUpdated,
              });
            }
          );
        }
      );
    });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
      key: "4",
    });
  }
};

const getAllQuestion = async (request, response) => {
  try {
    var sqlSelect =
      "SELECT customer_question_id, question,question_type, delete_flag, createtime, updatetime, mysqltime FROM customer_question_master WHERE delete_flag = 0 order by customer_question_id desc";

    connection.query(sqlSelect, async (err, result) => {
      if (err) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.internalServerError });
      }
      var homes_arr = [];

      if (result.length === 0) {
        return response
          .status(200)
          .json({
            success: false,
            msg: languageMessages.msgDataFound,
            homes_arr: homes_arr,
          });
      }

      var s_no = 0;

      for (var data of result) {
        s_no++;

        homes_arr.push({
          s_no: s_no,

          customer_question_id: data.customer_question_id,

          question: data.question,

          question_type  : data.question_type,

          question_type_lable : (data.question_type == 0) ? "Yes/No" : (data.question_type == 1) ? "Text" : "Date",

          createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),

        });
      }

      return response
        .status(200)
        .json({
          success: true,
          msg: languageMessages.msgDataFound,
          homes_arr: homes_arr,
        });
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};

const deleteQuestion = async (request, response) => {
  const { customer_question_id } = request.body;
  try {
    if (!customer_question_id) {
      return response
        .status(200)
        .json({
          success: false,
          msg: languageMessages.msg_empty_param,
          key: "customer_question_id",
        });
    }
    var sqlSelect = "SELECT customer_question_id, question FROM customer_question_master WHERE delete_flag = 0 AND customer_question_id = ?";

    connection.query(sqlSelect, [customer_question_id], async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response
          .status(200)
          .json({
            success: false,
            msg: languageMessages.msgDataFound,
            question_arr: question_arr,
          });
      }

      if (result.length > 0) {
        var updateSql =
          "UPDATE customer_question_master set delete_flag = 1 , updatetime = now() where delete_flag = 0 AND customer_question_id = ?";
        connection.query(updateSql, [customer_question_id], (err, updateQuestion) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }
          if (updateQuestion.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Error deleteing question" });
          }
          if (updateQuestion.affectedRows > 0) {
            return response.status(200).json({success: true,msg: languageMessages.deleteQuestionSuccess});
          }
        });
      }
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message});
  }
};


const editQuestion = async (request, response) => {
  const { customer_question_id, question, questionType } = request.body;

  try {
    if (!customer_question_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "customer_question_id"});
    }

    if (!question) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "question"});
    }

    if (!questionType) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "questionType"});
    }


    const checkCategory = "SELECT customer_question_id, question, delete_flag, createtime, updatetime, mysqltime FROM customer_question_master WHERE delete_flag = 0 AND customer_question_id = ?";
    connection.query(checkCategory, [customer_question_id], (err, res) => {
      if (err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "1"});
      }
      if (res.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "questionNotFound"});
      }

      const checkDuplicateName = "SELECT customer_question_id, question FROM customer_question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?) AND customer_question_id != ?";
      connection.query(checkDuplicateName,[question,customer_question_id],(duplicateErr, duplicateRes) => {
          if (duplicateErr) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
          }
          if (duplicateRes.length > 0) {
            return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "QuestionAlreadyExist"});
          }

        const updateCategory = "UPDATE customer_question_master set question_type = ? , question = ? WHERE delete_flag = 0 AND customer_question_id = ?";
        connection.query(updateCategory,[questionType,question,customer_question_id],async (updateError, result) => {
            if (updateError) {
              return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "3"});
            }
            if (result.affectedRows <= 0) {
              return response.status(200).json({success: false,msg: languageMessages.errorUpdating});
            }
          return response.status(200).json({success: true,msg: languageMessages.DetailsUpdated});
        });
      });
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message,key: "4"});
  }
};


const addQuestion = async (request, response) => {
  const { question, questionType} = request.body;

  try {
    if (!question) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "question",});
    }

    if (!questionType) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "questionType",});
    }
 
 
    const checkDuplicateName = "SELECT customer_question_id, question FROM customer_question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?);";
    connection.query(checkDuplicateName,[question],(duplicateErr, duplicateRes) => {
      if (duplicateErr) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
      }
      if (duplicateRes.length > 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "QuestionAlreadyExist" });
      }

      const insertQuestion ="INSERT INTO customer_question_master(question,question_type,createtime,updatetime) VALUES (?,?,now(),now())";
      connection.query(insertQuestion, [question,questionType],(updateError, result) => {
        if (updateError) {
          return response.status(200).json({success: false,msg: languageMessages.internalServerError,updateError: updateError.message});
        }
        if (result.affectedRows <= 0) {
          return response.status(200).json({success: false,msg: languageMessages.errorUpdating});
        }
      return response.status(200).json({success: true, msg: languageMessages.QuestionAddSucessfully});
    }); 
  })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "4",error : error.message});
  }
}
 



const getContactUsData = async (request,response) => {
  try {
    var sqlSelect =
      "SELECT cm.contact_id,cm.name, cm.user_id, cm.name,um.username,cm.email, cm.message,cm.status, cm.subject, cm.reply, cm.replied_date_time, cm.createtime, cm.mobile FROM contact_us_master as cm JOIN user_master as um on cm.user_id = um.user_id WHERE cm.delete_flag = 0 AND um.delete_flag = 0 order by cm.contact_id desc";

    connection.query(sqlSelect, async (err, result) => {
      if (err) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.internalServerError, error : err.message , key : "1" });
      }
      var contact_arr = [];

      if (result.length === 0) {
        return response
          .status(200)
          .json({
            success: false,
            msg: languageMessages.msgDataFound,
            contact_arr: contact_arr,
          });
      }

      var s_no = 0;

      for (var data of result) {
        s_no++;

        contact_arr.push({
          s_no: s_no,

          contact_id: data.contact_id,

          username: data.username,

          name : data.name,

          email: data.email,

          message: data.message,

          // reason : data.reason,

          status : data.status,

          status_lable_filter : (data.status == 0) ? "pending" : "replied",

          status_lable : "0=pending,1=replied",

          subject : data.subject,

          reply_datetime : (data.replied_date_time) ? moment(data.replied_date_time).format("DD-MM-YYYY HH:mm A")  : "NA",

          reply : data.reply,

          createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
        });
      }

      return response
        .status(200)
        .json({
          success: true,
          msg: languageMessages.msgDataFound,
          contact_arr: contact_arr,
        });
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError, error : error.message });
  }
}


const updateStatus = async (request, response) => {
  const { contact_id, message } = request.body;

  if (!contact_id || !message) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msg_empty_param });
  }

  // console.log(contact_id);

  try {
    var check =
      "SELECT contact_id, status FROM contact_us_master WHERE contact_id = ? AND delete_flag = 0";

    connection.query(check, [contact_id], async (err, res) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          error: err,
        });
      }

      if (res.length <= 0) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgDataNotFound });
      }

      if (res.length > 0) {
        var update =
          "UPDATE contact_us_master SET status = 1 ,reply = ? , replied_date_time = NOW() WHERE contact_id =? ";

        connection.query(update, [message, contact_id], async (err) => {
          if (err) {
            return response.status(200).json({
              success: false,
              msg: languageMessages.internalServerError,
              error: err,
            });
          } else {
            return response.status(200).json({
              success: true,
              msg: languageMessages.repliedSuccessfully,
              msg: message,
            });
          }
        });
      } else {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgDataNotFound });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};


const SendMail = async (req, response) => {
  try {
    const { user_email, user_name, message, title } = req.body;

    // Check if required fields are provided
    if (!user_email || !user_name || !message || !title) {
      return response
        .status(200)
        .json({ success: false, msg: "req", error: req.body });
    }

    const fetchAdmin =
      "SELECT username, email FROM user_master WHERE user_type = 0 AND delete_flag = 0";

    connection.query(fetchAdmin, async (err, result) => {
      if (err) {
        return response
          .status(500)
          .json({ success: false, msg: languageMessages.internalServerError ,err : err.message});
      }
      if (result.length <= 0) {
        return response
          .status(404)
          .json({ success: false, msg: languageMessages.msgDataNotFound });
      }
      if (result.length > 0) {
        const adminName = result[0].username;
        const adminEmail = result[0].email;

        const subject = "Contact Us Reply";
        const newMsg = message;
        const app_name = "Parkom";
        const app_logo =
          "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";

        const mailBody = mailBodyContactUs({
          adminName,
          adminEmail,
          user_email,
          title,
          subject,
          user_name,
          newMsg,
          app_logo,
          app_name,
        });

        try {
          const mailResponse = await sendMail(user_email, subject, mailBody);
          if (mailResponse.success) {
            return response
              .status(200)
              .json({ success: true, msg: languageMessages.EmailSent });
          } else {
            return response.status(200).json({
              success: false,
              msg: "error1",
              error: mailResponse.error,
            });
          }
        } catch (error) {
          console.error("Error sending email:", error);
          return response.status(200).json({
            success: false,
            msg: "error1",
            error: error.message,
          });
        }
      }
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return response
      .status(500)
      .json({ success: false, error: error.message, msg: "err2" });
  }
};


const fetchaboutcontent = async (request, response) => {

  const { contentType } = request.query;

  // console.log(contentType);

  if (!contentType) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msg_empty_param });
  }

  try {
    var fetch =
      "SELECT content,content_1,content_3 FROM content_master WHERE content_type = ? AND delete_flag = 0";

    connection.query(fetch, [contentType], async (err, res) => {
      if (err) {
        return response
          .status(20)
          .json({ success: false, smg: languageMessages.internalServerError });
      }

      if (res.length <= 0) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgDataNotFound });
      }

      if (res.length > 0) {
        return response
          .status(200)
          .json({ success: true, msg: languageMessages.msgDataFound, res });
      } else {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgDataNotFound });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};


const updateContent = async (request, response) => {

  const contentType = request.body.contentType;

  const content = request.body.content;

  const language = request.body.lang;

  if (contentType === undefined || content === undefined) {

    return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "none"});
  }


  if (language === undefined) {

    return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "language"});
  }

  const language_type = language === 'english' ? 'content' : language === 'arabic' ? 'content_3' : 'content_1';


  try {
    const check =
      "SELECT content_type FROM content_master WHERE content_type = ? AND delete_flag = 0";

    connection.query(check, [contentType], async (err, res) => {
      if (err) {
        console.error("Error executing SELECT query:", err);

        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (res.length <= 0) {
        return response.status(200).json({ success: false, msg: languageMessages.msgDataNotFound });
      }

      const updateQuery = `UPDATE content_master SET ${language_type} = ? WHERE content_type = ?`;

      connection.query(updateQuery,[content, contentType],async (err, res1) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }


          if (res1.affectedRows > 0) {
            return response.status(200).json({ success: true, msg: languageMessages.ContentUpdated });
          } else {
            return response.status(200).json({ success: false, msg: "No rows affected" });
          }
      });
    });
  } catch (error) {
    console.error("Error updating content:", error);

    response.status(200).json({ success: false, msg: languageMessages.internalServerError });
  }
};



const getTabularUser = async (request,response) => {
  const {from_date,to_date} = request.query;
  try {
    if(!from_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }
    var sqlSelect = `SELECT user_id, f_name, address, admission_type, name,mobile, createtime, updatetime 
    FROM user_master  WHERE delete_flag = 0  AND Date(createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;

    connection.query(sqlSelect, [from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name: data.name,

            address: data.address,

            admission_type: data.admission_type,

            mobile: data.mobile,

           

            mobile: data.mobile,

         
            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
      // }
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}


const getAdminAllData = async (request,response) => {
  try {
    const sqlCheckUser =
    "SELECT user_id,email,username,name, password, user_id, active_flag, user_type, image FROM user_master WHERE delete_flag = 0 AND user_type = 0";

  connection.query(sqlCheckUser,  async (err, userResult) => {
    if (err) {
      return response.status(200).json({success: false,msg: languageMessages.internalServerError,err: err.message,
      });
    }

    if (userResult.length <= 0) {
      return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "email",
      });
    }

    if (userResult.length > 0) {
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,key: "data found",info: userResult,});
     }
  });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}

const UpdateAdminPassword = async (request, response) => {
  const { oldpassword, newPassword } = request.body;

  try {
    if (!oldpassword) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "old_password",
      });
    }

    if (!newPassword) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "new_password",
      });
    }

    var sql =
      "SELECT user_id FROM user_master WHERE user_type = 0 and delete_flag = 0";

    connection.query(sql, async (err, info) => {
      if (err) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.internalServerError });
      }

      if (info.length <= 0) {
        return response
          .status(200)
          .json({ success: false, msg: languageMessages.msgUserNotFound });
      }

      if (info[0].active_flag === 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.accountdeactivated,
          active_status: 0,
        });
      }

      // console.log(info[0].user_id);

      var sqlforget = "select password from user_master where user_id = ?";

      connection.query(sqlforget, [info[0].user_id], async (err, data) => {
        if (err) {
          return response
            .status(200)
            .json({ success: false, msg: languageMessages.internalServerError });
        } else {
          if (data.length <= 0) {
            return response
              .status(200)
              .json({ success: false, msg: languageMessages.msgDataNotFound });
          }

          var password = data[0].password;

          // console.log(password);

          const old_password_hash = await hashPassword(oldpassword);

          if (password === old_password_hash) {
            const new_pass = await hashPassword(newPassword);

            if(new_pass != old_password_hash) {
              var updateSql = "UPDATE user_master SET password=?, updatetime = NOW() WHERE user_id = ? AND delete_flag = 0";

            connection.query(updateSql, [new_pass, info[0].user_id], (err) => {
              if (err) {
                return response.status(200).json({success: false,msg: languageMessages.internalServerError});
              } else {
                return response.status(200).json({success: true,msg: languageMessages.PasswordUpdatedSuccessfully,key: "success" });
              }
            });
            } else {
              return response.status(200).json({
                success: true,
                msg: languageMessages.newOldPassword,
                key: "samePassword",
              });
            }
          } else {
            return response.status(200).json({
              success: false,
              msg: languageMessages.newOldPassword,
              key: "failure",
            });
          }
        }
      });
    });
  } catch (error) {
    console.error("Error:", error);

    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};


// const UpdateAdminProfile = async (req, res) => {
//   const { name, email } = req.body;

  // let image = req.file ? req.file.filename : null;

  // if (!name || !email) {
  //   return res
  //     .status(200)
  //     .json({ success: false, msg: languageMessages.msg_empty_param });
  // }

//   try {
//     let updateQuery;
//     let params;

//     if (image) {
      // updateQuery =
      //   "UPDATE user_master SET name = ?, email = ?,  image = ? WHERE user_type = 0 AND delete_flag = 0";
      // params = [name, email, image];
//     } else {
//       updateQuery =
//         "UPDATE user_master SET name = ?, email = ?  WHERE user_type = 0 AND delete_flag = 0";
//       const selectQuery =
//         "SELECT image FROM user_master WHERE user_type = 0 AND delete_flag = 0";
//       connection.query(selectQuery, (err, result) => {
//         if (err) {
//           console.error("Error fetching current image:", err);
//           return res
//             .status(200)
//             .json({ success: false, msg: languageMessages.internalServerError });
//         }
//         if (result.length > 0) {

//           image = result[0].image;
//           params = [name, email];
//           connection.query(updateQuery, params, (err, result) => {
//             if (err) {
//               console.error("Error updating profile:", err);
//               return res.status(200).json({
//                 success: false,
//                 msg: languageMessages.internalServerError,
//               });
//             }
//             if (result.affectedRows > 0) {
//               return res.status(200).json({
//                 success: true,
//                 msg: "Admin profile updated successfully.",
//                 key: "Edit",
//               });
//             } else {
//               return res
//                 .status(200)
//                 .json({ success: false, msg: "Failed to update profile." });
//             }
//           });
//         } else {
//           return res
//             .status(200)
//             .json({ success: false, msg: "No existing image found." });
//         }
//       });
//       return;
//     }

//     connection.query(updateQuery, params, (err, result) => {
//       if (err) {
//         console.error("Error updating profile:", err);
//         return res
//           .status(500)
//           .json({ success: false, msg: "Internal server error." });
//       }
//       if (result.affectedRows > 0) {
        // return res.status(200).json({
        //   success: true,
        //   msg: "Admin profile updated successfully.",
        //   key: "Edit",
        // });
//       } else {
      //   return res
      //     .status(200)
      //     .json({ success: false, msg: "Failed to update profile." });
      // }
//     });
//   } catch (error) {
//     console.error("Exception during profile update:", error);
//     return res
//       .status(200)
//       .json({ success: false, msg: languageMessages.internalServerError });
//   }
// };
const UpdateAdminProfile = async (request, response) => {
  const { name, email } = request.body;
  try {
    let image = request.file ? request.file.filename : null;

    if (!name || !email) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param });
    }

    let updateQuery = "UPDATE user_master SET username = ?, email = ?";
    let params = [name, email];

    if (image) {
      updateQuery += ", image = ?";
      params.push(image);
    }

    updateQuery += " WHERE user_type = 0 AND delete_flag = 0";

    connection.query(updateQuery, params, (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, err: err.message });
      }
      if (result.affectedRows > 0) {
        return response.status(200).json({ success: true, msg: "Admin profile updated successfully.", key: "Edit" });
      } else {
        return response.status(200).json({ success: false, msg: "Failed to update profile." });
      }
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: lang.internalServerError, error: error.message });
  }
};


//=====================getUserAnalyticalReports ==================================//

const getUserAnalyticalReports = async (req, res) => {

    const data = req.query;

    if (!data) {

      return res.status(200).json({
        status: true,
        msg: languageMessages.msg_empty_param,
        key: "from_date",
      });

    } else if (!data.action) {

      return res.status(200).json({
        status: true,
        msg: languageMessages.msg_empty_param,
        key: "from_date",
      });

    }

    else if (data.action !== 'get_users_analytical_report') {

     return res.status(200).json({
       status: true,
       msg: languageMessages.msg_empty_param,
       key: "from_date",
     });

    } else {




        try {
            const month_report_arr = [];
            const year_report_arr = [];
            const month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const current_year = new Date().getFullYear();

            for (let i = 0; i < month_arr.length; i++) {
                const month_text = month_arr[i];
                const current_month = i + 1;
                const month_user_arr = await getUserAnalyticalReportsData(
                  "monthly",
                  current_year,
                  current_month,
                  "All"
                );
                month_report_arr.push({ month: month_text, month_user_arr: month_user_arr });
            }

            for (let i = 2020; i <= current_year; i++) {
                const year_user_arr = await getUserAnalyticalReportsData(
                  "yearly",
                  i,
                  "",
                  "All"
                );
                year_report_arr.push({ year: i, year_user_arr: year_user_arr });
            }

            const record = {
              success: true,
              msg: languageMessages.msgDataFound,
              data: { month_report_arr, year_report_arr },
            };
            return res.json(record);

        } catch (error) {
            // console.log("database error key 2:", error);
            const record = { success: false, msg: languageMessages.internalServerError, key: error };
            return res.json(record);
        }

    }

};



function getUserAnalyticalReportsData(
  type,
  current_year,
  current_month,
  get_by_type 
) {
  // console.log("current_month:", current_month);

  return new Promise((resolve, reject) => {
    let whereClause = "";

    if (type === "monthly" && get_by_type === "All") {
      whereClause = `AND YEAR(createtime) = ${current_year} AND MONTH(createtime) = ${current_month}`;
    } else if (type === "yearly" && get_by_type === "All") {
      whereClause = `AND YEAR(createtime) = ${current_year}`;
    }

    const query = `SELECT user_id FROM user_master WHERE  delete_flag = 0  ${whereClause}  ORDER BY user_id DESC`;

    connection.query(query, (error, rows) => {
      if (error) {
        console.error("Database query error:", error);
        reject(error); // Reject the promise with the error
        return;
      }

      const userCount = rows.length > 0 ? rows.length : 0;
      resolve(userCount); // Resolve the promise with the count of rows
    });
  });
}



//===================== end getUserAnalyticalReports=============================//


//===================== end getUserAnalyticalReports=============================//

const fetchUsers = async (request, response) => {
  var fetch =
    "SELECT user_id, name, mobile FROM user_master WHERE delete_flag = 0 ";

  connection.query(fetch, async (err, res) => {
    if (err) {
      return response
        .status(200)
        .json({ success: false, msg: languageMessages.internalServerError });
    }

    if (res.length <= 0) {
      return response
        .status(200)
        .json({ success: false, msg: "data not foung" });
    }

    if (res.length > 0) {
      return response
        .status(200)
        .json({ success: true, msg: "data foung", res });
    } else {
      return response
        .status(200)
        .json({ success: false, msg: "user not foung" });
    }
  });
};

const sendBroadcastMessage = async (req, res) => {
  if (!req.body) {
    return res.json({ success: false, msg: "All fields are required", key: 1 });
  }

  const data = req.body;

  // Check for required fields
  if (
    !data ||
    !data.action ||
    !data.message ||
    !data.subject ||
    !data.userType
  ) {
    return res.json({
      success: false,
      msg: "All fields are required",
      key: 2,
      data,
    });
  }

  const { subject, userType, select_arr } = data;
  const send_message = data.message;

  try {
    let user_arr = [];

    if (userType === "all") {
      // Get all notification users if userType is 'all'
      user_arr = await getAllNotificationUsers(userType);
    } else {
      // If select_arr is present, map selected users
      if (select_arr && select_arr.length > 0) {
        user_arr = select_arr.map((user_id) => ({
          user_id,
          user_type: userType,
        }));
      } else {
        // Otherwise, get all users based on userType
        user_arr = await getAllNotificationUsers(userType);
      }
    }

    let successArr = [];
    let failedArr = [];

    // return res.json({
    //   success: false,
    //   msg: "Server error",
    //   key: user_arr
    // });

    // Iterate over the users and process notifications
    for (let user of user_arr) {
      try {
     
        const user_id = user.user_id; // Directly use user_id as it's a number
        const user_type = user.user_type;
        const user_id_notification = 1; // Set notification sender id (assumed 1)
        const other_user_id_notification = user_id;
        const action = "broadcast";
        const action_id = "";
        const title = [subject, subject, subject, subject];
        const message = [
          send_message,
          send_message,
          send_message,
          send_message,
        ];
        const action_data = {
          user_id: user_id_notification,
          other_user_id: other_user_id_notification,
          action_id,
          action,
        };

        const notificationArrCheck =
          await getNotificationArrSingle(
            user_id_notification,
            other_user_id_notification,
            action,
            action_id,
            title,
            message,
            action_data,
            
          );
          // return res.json({
          //   success: false,
          //   msg: "654+529834953",
          //   key: 'in',
          //   insertStatus:notificationArrCheck,
          //   action_data:action_data
          // });

        if (notificationArrCheck !== "NA") {
          let notificationArr = [notificationArrCheck];
          let notstatus = "";

          // Send notification based on user_type
          if (notificationArr.length > 0) {
            if (user_type === "all") {
              if (notificationArr.length !== 0) {
                notstatus = await oneSignalNotificationSendCall(
                  notificationArr
                );
                successArr.push(notstatus);
              }
            }

            if (user_type === "user") {
              if (notificationArr.length !== 0) {
                notstatus = await oneSignalNotificationSendCall(
                  notificationArr
                );
                successArr.push(notstatus);
              }
            }

            // Check if notstatus is successful and push it to successArr
            if (notstatus && notstatus.success) {
              successArr.push({ user_id, status: "success" });
            } else {
              // console.log(`Failed to send notification to user ${user_id}`);
              failedArr.push({ user_id, status: "failed" });
            }
          }
        } else {
          // console.log(`Notification array check failed for user ${user_id}`);
          failedArr.push({ user_id, status: "failed" });
        }
      } catch (error) {
        // Log error for specific user, but continue processing others
        console.error(
          `Error sending notification to user ${user?.user_id}:`,
          error.message
        );
        failedArr.push({
          user_id: user?.user_id,
          status: "failed",
          error: error.message,
        });
      }
    }

    // After all notifications have been attempted, return the results
    return res.json({
      success: successArr.length > 0,
      success: true,
      msg:
        successArr.length > 0
          ? languageMessages.msgNotificationSendSuccess
          : "Failed to send notifications",
      successArr,
    });
  } catch (error) {
    console.error("Database error:", error.message);
    return res.json({
      success: false,
      msg: "Server error",
      key: error.message,
    });
  }
};

  function  getAllNotificationUsers (userType) {



        let s_no = 0;

        let query = '';



        if (userType === 'user') {

            query = 'SELECT  `user_id`, `user_type`, `username`, `image`, `mobile`,  `createtime`  FROM `user_master` WHERE  delete_flag = 0 order by user_id desc';

        } else {

            query =
              "SELECT  `user_id`, `user_type`, `username`, `image`, `mobile`,  `createtime`  FROM `user_master` WHERE  delete_flag = 0 order by user_id desc";

        }

        return new Promise((resolve, reject) => {





            connection.query(query, (error, rows) => {

                if (error) {

                    // console.log('database user get all error ')

                    reject(error); // Reject the promise with the error

                } else {

                    let user_arr = '';

                    if (rows.length > 0) {

                        rows.forEach(row => {

                            s_no++;

                            row.s_no = s_no;

                            row.createtime = moment(row.createtime).format('DD-MM-YYYY h:mm A');

                            // row.user_id = Buffer.from(row.user_id.toString()).toString('base64');
                            row.user_id=row.user_id;
                            if (row.user_type === 1) {

                                row.user_type = 'user';

                            } else {

                                row.user_type = '';

                            }

                    



                        });

                        user_arr = rows;

                    } else {

                        user_arr = [];

                    }

                    resolve(user_arr); // Resolve the promise with the rows

                }

            });

        });



    };
    async function getNotificationStatus(user_id) {
      return new Promise((resolve, reject) => {
        const sql = "SELECT user_id FROM user_master WHERE user_id = ?";
        
        connection.query(sql, [user_id], (error, results) => {
          if (error) {
            console.error('Error getting notification status:', error);
            return resolve('no');
          } else {
            if (results.length > 0) {
              return resolve('yes');
            } else {
              return resolve('no');
            }
          }
        });
      });
    }
    
 
 async function getNotificationArrSingle(user_id, other_user_id, action, action_id, subject,send_message, action_data) {
  // return action_data;
  try {
    const insertStatus = await insertNotification(user_id, other_user_id, action, action_id, JSON.stringify(action_data), subject[0], subject[0], subject[0], subject[0], send_message[0], send_message[0], send_message[0], send_message[0]);


   
    if (insertStatus === 'yes') {
      
 
  
      const notificationStatus = await getNotificationStatus(other_user_id);
      
      if (notificationStatus === 'yes') {
        
        const player_id = await getUserPlayerId(other_user_id);
        
        if (player_id !== 'no') {
         
          const language_id = await getUserLanguageId(other_user_id);
          // return language_id;
          let titleToSend = subject[0];
          let messageToSend = send_message[0];
          // if (language_id === 1) {
          //   titleToSend = title_2;
          //   messageToSend = message_2;
          // } 
     
          // else if (language_id === 2) {
          //   titleToSend = title_3;
          //   messageToSend = message_3;
          // } else if (language_id === 3) {
          //   titleToSend = title_4;
          //   messageToSend = message_4;
          // }else{
          //   titleToSend = '';
          //   messageToSend = '';
          // }
          return {
            player_id: player_id,
            title: titleToSend,
            message: messageToSend,
            action_json: action_data
          };
        }
      }
    }
    return 'NA';
  } catch (error) {
    console.error('Error in getNotificationArrSingle:', error);
    return 'NA';
  }
};

function formatDate(inputDate) {
  const date = new Date(inputDate);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



async function insertNotification(user_id, other_user_id, action, action_id, action_json, title, title_2, title_3, title_4, message, message_2, message_3, message_4) {
  try {
    
    const read_status = 0;
    const delete_flag = 0;
    const createtime = formatDate(new Date());
    const updatetime = formatDate(new Date());
    // const updatetime = new Date().toISOString();
    // const createtime = new Date().toISOString();
    
    // const vikas=[title, title_2, title_3, title_4, message, message_2, message_3, message_4, read_status, delete_flag, createtime, updatetime];
    // return vikas;
    const query = 'INSERT INTO user_notification_message(user_id, other_user_id, action, action_id, action_json, title, title_2, title_3, title_4, message, message_2, message_3, message_4, read_status, delete_flag, createtime, updatetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values=[user_id, other_user_id, action, action_id, action_json, title, title_2, title_3, title_4, message, message_2, message_3, message_4, read_status, delete_flag, createtime, updatetime];
    await connection.query(query, values);
    return 'yes';
   
  } catch (error) {
    console.error('Error inserting notification:', error);
    return 'no';
  }
};
// Function to get user language id
async function getUserLanguageId(user_id) {
  try {
    const query = 'SELECT language_id FROM user_master WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      connection.query(query, [user_id], (error, rows) => {
        if (error) {
          console.error('Error fetching user language id:', error);
          return resolve(0); // Return 0 in case of an error
        }
        // Resolve with language_id or 0 if no rows found
        resolve(rows.length > 0 ? rows[0].language_id : 0);
      });
    });
  } catch (error) {
    console.error('Error fetching user language id:', error);
    return error.message; // Return 0 in case of an unexpected error
  }
}


// Function to get user player id
async function getUserPlayerId(user_id) {
  try {
    const query = 'SELECT player_id FROM user_notification WHERE user_id = ?';
    return new Promise((resolve, reject) => {
      connection.query(query, [user_id], (error, rows) => {
        if (error) {
          console.error('Error fetching user player id:', error);
          return resolve('no');
        }
        resolve(rows.length > 0 ? rows[0].player_id : 'no');
      });
    });
  } catch (error) {
    console.error('Error fetching user player id:', error);
    return 'no';
  }
}


async function oneSignalNotificationSendCall(notificationArr) {
  if (notificationArr !== "NA") {
    for (const notification of notificationArr) {
      const playerIdArr = [];

      if (notification.player_id !== "") {
        playerIdArr.push(notification.player_id);

        const languageId = 0;

        const title = notification.title;

        const message = notification.message;

        const actionJson = notification.action_json;

        return await oneSignalNotificationSend(
          title,
          message,
          actionJson,
          playerIdArr,
          languageId
        );
      }
    }
  }
};

async function oneSignalNotificationSend(
  title,
  message,
  jsonData,
  playerIdArr,
  languageId
) {
  //return title;
  const axios = require("axios");

  const oneSignalAppId = "707dfad6-078f-44b0-8a52-96a2c248b3a4";

  const oneSignalAuthorization =
    "M2ExZjFhMDUtNzA0ZC00NmZkLWFjNDEtMGMwMDAyM2FjNjhj";

  // Define notification fields

  let fields;

  if (languageId === 0) {
    fields = {
      app_id: oneSignalAppId,

      contents: { en: message },

      headings: { en: title },

      include_player_ids: playerIdArr,

      data: { action_json: jsonData },

      ios_badgeType: "Increase",

      ios_badgeCount: 1,

      priority: 10,

      big_picture: jsonData.image, // For Android - Add image to the notification
      ios_attachments: { id1: jsonData.image }, // For iOS - Add image to the notification
    };
  } else {
    fields = {
      app_id: oneSignalAppId,

      contents: { ar: message },

      headings: { ar: title },

      include_player_ids: playerIdArr,

      data: { action_json: jsonData },

      ios_badgeType: "Increase",

      ios_badgeCount: 1,

      priority: 10,

      big_picture: jsonData.image, // For Android - Add image to the notification
      ios_attachments: { id1: jsonData.image }, // For iOS - Add image to the notification
    };
  }

  try {
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      fields,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",

          Authorization: `Basic ${oneSignalAuthorization}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    return error.message
  }
}

const getAllFaqQuestion = async (request,response) => {
  try {
    var sqlSelect = "SELECT faq_id, question, answer, createtime FROM faq_master WHERE delete_flag = 0 order by faq_id desc";

    connection.query(sqlSelect, async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }
      var faq_arr = [];
      if (result.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound,faq_arr: faq_arr});
      }
      var s_no = 0;
      for (var data of result) {
        s_no++;
        faq_arr.push({
          s_no: s_no,
          faq_id: data.faq_id,
          question: data.question,
          answer : data.answer,
          createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
        });
      }
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,faq_arr: faq_arr});
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
}


const deleteFaq = async (request, response) => {

  const { faq_id } = request.body;

  try {

    if (!faq_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "faq_id"});
    }

    var sqlSelect = "SELECT faq_id,question, answer, createtime FROM faq_master WHERE delete_flag = 0 AND faq_id = ?";
    connection.query(sqlSelect, [faq_id], async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound});
      }

      if (result.length > 0) {
        var updateSql = "UPDATE faq_master set delete_flag = 1 , updatetime = now() where delete_flag = 0 AND faq_id = ?";
        connection.query(updateSql, [faq_id], (err, updateQuestion) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }
          if (updateQuestion.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Error deleteing faq" });
          }
          if (updateQuestion.affectedRows > 0) {
            return response.status(200).json({success: true,msg: languageMessages.deleteFaqSuccess});
          }
        });
      }
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message});
  }
};

const addFAQ = async (request,response) => {
  const { question,answer} = request.body;

  try {
    if (!question) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "question"});
    }

    if (!answer) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "answer"});
    }
 
    const checkDuplicateName = "SELECT faq_id, question, answer, createtime FROM faq_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?);";

    connection.query(checkDuplicateName,[question],(duplicateErr, duplicateRes) => {

      if (duplicateErr) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
      }

      if (duplicateRes.length > 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "FaqAlreadyExist" });
      }

      const insertQuestion ="INSERT INTO faq_master(question,answer,createtime,updatetime) VALUES (?,?,now(),now())";

      connection.query(insertQuestion, [question,answer],(updateError, result) => {

        if (updateError) {

          return response.status(200).json({success: false,msg: languageMessages.internalServerError,updateError: updateError.message});

        }

        if (result.affectedRows <= 0) {

          return response.status(200).json({success: false,msg: languageMessages.errorUpdating});

        }
      return response.status(200).json({success: true, msg: languageMessages.FaqAddSucessfully});

    }); 

  })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "4",error : error.message});
  }
}


const editFaq = async (request,response) => {
  const { faq_id, question, answer } = request.body;

  try {
    if (!faq_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "faq_id"});
    }

    if (!question) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "question"});
    }

    if (!answer) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "answer"});
    }

    const checkCategory = "SELECT faq_id question, answer, createtime FROM faq_master WHERE delete_flag = 0 AND delete_flag = 0 AND faq_id = ?";
    connection.query(checkCategory, [faq_id], (err, res) => {
      if (err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "1"});
      }
      if (res.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "faqNotFound"});
      }

      const checkDuplicateName = "SELECT faq_id, question FROM faq_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?) AND faq_id != ?";
      connection.query(checkDuplicateName,[question,faq_id],(duplicateErr, duplicateRes) => {
          if (duplicateErr) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
          }
          if (duplicateRes.length > 0) {
            return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "faqAlreadyExist"});
          }

        const updateCategory = "UPDATE faq_master set question = ?, answer = ?, updatetime = now()  WHERE delete_flag = 0 AND faq_id = ?";
        connection.query(updateCategory,[question,answer,faq_id],async (updateError, result) => {
            if (updateError) {
              return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "3"});
            }
            if (result.affectedRows <= 0) {
              return response.status(200).json({success: false,msg: languageMessages.errorUpdating});
            }
          return response.status(200).json({success: true,msg: languageMessages.DetailsUpdated});
        });
      });
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message,key: "4"});
  }
}


const getSubscription = async (request,response) => {
  try {
    // var sqlSelect = "SELECT subscription_id, plan_type, amount, description,description_arabic, no_of_days,createtime FROM subscription_master WHERE delete_flag = 0 order by subscription_id desc";
    var sqlSelect = "SELECT subscription_id, subscription_type, amount, description, duration,createtime FROM subscription_master WHERE delete_flag = 0 order by subscription_id desc";
    connection.query(sqlSelect,async (Error,resultSubscription) => {
      if(Error) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: Error.message});
      } 
      var subscription_arr = [];
      var s_no = 0;
      if(resultSubscription.length > 0) {
        for(var data of resultSubscription) {
          s_no++;
          subscription_arr.push({
            s_no: s_no,
            subscription_id : data.subscription_id,
            subscription_type : data.subscription_type,
            subscription_type_filter : (data.subscription_type == 0) ?  "Free" : (data.subscription_type == 1) ? "Standard" : "Premium",
            subscription_type_lable : "0=free 1=standard 2=premium",
            amount : data.amount,
            description : data.description,
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY HH:mm A")
          })
        }
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,subscription_arr : subscription_arr});
      }else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,subscription_arr : subscription_arr});
      }
    })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message}); 
  }
}

const addSubScription = async (request,response) => {
  const {description,duration,amount,subscriptionType} = request.body;
  try {
  
    if(!description) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "description"});
    }
    if(!duration) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "duration"});
    }
    if(!amount) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "amount"});
    }
    if(!subscriptionType) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "subscriptionType"});
    }
    var sqlInsert = "INSERT INTO subscription_master(subscription_type,amount,description,duration,createtime,updatetime) VALUES (?,?,?,?,now(),now())";
    connection.query(sqlInsert,[subscriptionType,amount,description,duration],async(err,result) => {
      if(err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: err.message});
      } 
      return response.status(200).json({success: true,msg: languageMessages.subscriptionAdd});
    })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message}); 
  }
}

const deleteSubscription = async (request,response) => {
  const {subscription_id} = request.body;
  try {
    if(!subscription_id) {
      return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "subscription_id"});
    }
    var sqlDelete = "UPDATE subscription_master SET delete_flag = 1, updatetime = now() WHERE subscription_id = ? AND delete_flag = 0";
    connection.query(sqlDelete,[subscription_id],(err,result) => {
      if(err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: err.message});
      } 
      return response.status(200).json({success: true,msg: languageMessages.subscriptionDelete});
    })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message}); 
  }
}

const getSubscriptionDetail = async (request,response) => {
  const {subscription_id} =  request.params;
  try {
    if(!subscription_id) {
      return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "subscription_id"});
    }
    var sqlSELECT = "SELECT * from subscription_master WHERE subscription_id = ? AND delete_flag = 0";
    connection.query(sqlSELECT,[subscription_id],(err,result) => {
      if(err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: err.message});
      } 
      var subscription_arr = [];
      if(result.length > 0) {
        for(var data of result) {
          subscription_arr.push({
            subscription_id : data.subscription_id,
            subscription_type : data.subscription_type,
            subscription_type_filter : (data.subscription_type == 0) ?  "Free" : (data.subscription_type == 1) ? "Standard" : "Premium",
            subscription_type_lable : "0=free 1=standard 2=premium",
            amount : data.amount,
            description : data.description,
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY HH:mm A")
          })
        }
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,result :subscription_arr.length ?  subscription_arr[0] : "NA"});
      }else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,result : "NA"});
      }
    })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message}); 
  }
}

const editSubscription = async (request, response) => {
  const { subscription_id, subscriptionType, amount, duration, description } = request.body;
  try {
    if (!subscription_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "subscription_id" });
    }
    if (!description) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "description" });
    }
    if (!duration) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "duration" });
    }
    if (!amount) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "amount" });
    }
    if (!subscriptionType) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "subscriptionType" });
    }

    const updateSubscription = `UPDATE subscription_master SET subscription_type = ?, amount = ?, duration = ?, description = ?,  updatetime = NOW() WHERE subscription_id = ? AND delete_flag = 0`;

    connection.query(
      updateSubscription,
      [subscriptionType, amount, duration, description, subscription_id],
      (err, result) => {
        if (err) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: err.message });
        }
        return response.status(200).json({ success: true, msg: languageMessages.subscriptionUpdated });
      }
    );
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
};

const getCustomer = async (request,response) => {
  const {user_id} = request.params;
  try {
    if (!user_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "user_id" });
    }
    var sqlSelect = "SELECT customer_id, user_id, f_name, l_name, name, phone_code, mobile, email, address, createtime FROM customer_master WHERE user_id = ? AND delete_flag = 0";
    connection.query(sqlSelect,[user_id],async (error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      var customer_arr = [];
      if(result.length <= 0) {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, customer_arr : customer_arr});
      }
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;

          customer_arr.push({
            s_no: s_no,
            user_id: data.user_id,
            customer_id : data.customer_id,
            f_name: data.f_name,
            l_name: data.l_name,
            email: data.email,
            mobile : data.mobile,
            address :data.address,
            createtime : moment(data.createtime).format("DD-MM-YYYY HH:mm A") 
          })
        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, customer_arr : customer_arr});
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
}


const getUserSubscription = async (request,response) => {
  const {user_id} = request.params;
  try {
    if (!user_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "user_id"}
      return response.json(record);
    }
    var sqlSelect = "SELECT user_subscription_id, user_id,	subscription_type, subscription_id, amount, start_date, end_date, transaction_id, status, duration, createtime FROM user_subscription_master WHERE user_id = ? AND delete_flag = 0";
    connection.query(sqlSelect,[user_id],(err,result) => {
      if (err) {

        return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: err.message });
        
      }
      var subscription_arr = [];
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;
          subscription_arr.push({
            s_no : s_no,
            user_subscription_id : data.user_subscription_id,
            user_id : data.user_id,
            subscription_type : data.subscription_type,
            subscription_type_lable :  data.subscription_type == 1 ? 'Free' : data.subscription_type == 2 ? 'Primium' : 'Standard',
            subscription_id : data.subscription_id,
            amount : data.amount,
            start_date : moment(data.start_date).format("DD-MM-YYYY") ,
            end_date :  moment(data.end_date).format("DD-MM-YYYY"),
            transaction_id : data.transaction_id,
            status : data.status,
            status_lable : data.status == 1 ? 'Active' : data.status == 2 ? 'Cancel' : 'Expired',
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY "),

          })

        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, result:(subscription_arr.length > 0) ? subscription_arr : []})
      } else {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, result:(subscription_arr.length > 0) ? subscription_arr : []})
      }
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}

const getCustomerQuestionAnswer = async (request,response) => {
  const {customer_id} = request.params;
  try {
    if (!customer_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "customer_id"}
      return response.json(record);
    }
    var question_arr = [];
    var sqlSelect = "SELECT customer_answer_id, customer_question_id, customer_id, answer, question_type, answer_2, date,createtime FROM customer_answer_master WHERE customer_id = ? AND delete_flag = 0";
    connection.query(sqlSelect,[customer_id],async(error,result) => {
      if (error) {
        return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
      }
      if(result.length > 0) {
        for(var data of result) {
          question_arr.push({
            customer_answer_id : data.customer_answer_id,
            customer_question_id : data.customer_question_id,
            question : await getQuestion(data.customer_question_id),
            customer_id : data.customer_id,
            answer  : data.answer,
            question_type : data.question_type,
            date : moment(data.date).format("DD-MM-YYYY ") ,
            answer_2 : data.answer_2,
            createtime : moment(data.createtime).format("DD-MM-YYYY"),
          })
        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, question_arr:question_arr})
      } else {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, question_arr:question_arr})
      }
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}

async function getQuestion(customer_question_id) {
  return new Promise((resolve,reject) => {
    var sqlSelect = "SELECT customer_question_id, question, question_type FROM customer_question_master WHERE customer_question_id = ? AND delete_flag = 0";
    connection.query(sqlSelect,[customer_question_id],async (error,result) => {
      if (error) {
        reject(error.message);
      } 
      resolve(result.length > 0 ? result[0].question : "NA")
    })
  }) 
}

const getCustomerDetail = async (request,response) => {
  const {customer_id} = request.params;
  try {
    if (!customer_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "customer_id"}
      return response.json(record);
    }
    var sqlSelect = "SELECT customer_id, user_id, f_name, l_name, name, phone_code, mobile, email, address, DATE_FORMAT(createtime, '%d-%m-%Y %l:%i %p') AS formatted_createtime FROM customer_master WHERE customer_id = ? AND delete_flag = 0;";
    connection.query(sqlSelect,[customer_id],async(error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,user_arr:result});
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}

const getDeletdCustomerDetail = async (request,response) => {
  const {customer_id} = request.params;
  try {
    if (!customer_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "customer_id"}
      return response.json(record);
    }
    var sqlSelect = "SELECT customer_id, user_id, f_name, l_name, name, phone_code, mobile, email, address, file, file_type, description, delete_question_1, delete_question_1_desc, delete_question_2, delete_question_2_desc,delete_desc,  delete_docs, delete_desc_type,  DATE_FORMAT(createtime, '%d-%m-%Y %l:%i %p') AS formatted_createtime FROM customer_master WHERE customer_id = ?";

    connection.query(sqlSelect,[customer_id],async(error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,user_arr:result});
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}

const getTotalEarnings = async (request,response) => {
  try {
    var sqlSelect = "SELECT SUM(usm.amount) as earnings FROM user_subscription_master as usm JOIN user_master as um ON usm.user_id = um.user_id WHERE um.delete_flag = 0 AND usm.delete_flag =0;";
    connection.query(sqlSelect,async(error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,user_arr:result});
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}


const getTabularBusiness = async (request,response) => {
  const {from_date,to_date} = request.query;
  try {
    if(!from_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }
    var sqlSelect = `SELECT user_id, login_type, user_type, f_name, l_name, username, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime 
    FROM user_master  WHERE delete_flag = 0 AND user_type = 2 AND profile_completed = 1  AND Date(createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;

    connection.query(sqlSelect, [from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            active_flag_lable: (data.active_flag === 1) ? "active" : "deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}

const getTabularBusinessClaims = async (request,response) => {
  const {from_date,to_date} = request.query;
  try {
    if(!from_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }
    var sqlSelect = `SELECT cm.customer_id, cm.user_id, cm.f_name, cm.l_name, cm.name, cm.phone_code, cm.mobile, cm.email, cm.address, cm.file, cm.file_type, cm.description, cm.delete_question_1, cm.delete_question_1_desc, cm.delete_question_2, cm.delete_question_2_desc,  cm.delete_docs, cm.delete_desc_type, cm.createtime FROM customer_master as cm JOIN user_master as um ON cm.user_id = um.user_id WHERE cm.delete_flag = 0 AND um.delete_flag = 0 AND Date(cm.createtime) BETWEEN ? AND ?  ORDER BY cm.user_id DESC`;

    connection.query(sqlSelect, [from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            customer_id : data.customer_id,

            user_id: data.user_id,

            f_name: data.f_name,

            l_name: data.l_name,

            email: data.email,

            address: data.address,

            mobile: data.mobile,

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}

const getBusinessAnalyticalReports = async (req, res) => {

  const data = req.query;

  if (!data) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  } else if (!data.action) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  }

  else if (data.action !== 'get_business_analytical_report') {

   return res.status(200).json({
     status: true,
     msg: languageMessages.msg_empty_param,
     key: "from_date",
   });

  } else {




      try {
          const month_report_arr = [];
          const year_report_arr = [];
          const month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const current_year = new Date().getFullYear();

          for (let i = 0; i < month_arr.length; i++) {
              const month_text = month_arr[i];
              const current_month = i + 1;
              const month_user_arr = await getBusinessAnalyticalReportsData(
                "monthly",
                current_year,
                current_month,
                "All"
              );
              month_report_arr.push({ month: month_text, month_user_arr: month_user_arr });
          }

          for (let i = 2020; i <= current_year; i++) {
              const year_user_arr = await getBusinessAnalyticalReportsData(
                "yearly",
                i,
                "",
                "All"
              );
              year_report_arr.push({ year: i, year_user_arr: year_user_arr });
          }

          const record = {
            success: true,
            msg: languageMessages.msgDataFound,
            data: { month_report_arr, year_report_arr },
          };
          return res.json(record);

      } catch (error) {
          console.log("database error key 2:", error);
          const record = { success: false, msg: languageMessages.internalServerError, key: error };
          return res.json(record);
      }

  }

};
function getBusinessAnalyticalReportsData(
type,
current_year,
current_month,
get_by_type
) {
// console.log("current_month:", current_month);

return new Promise((resolve, reject) => {
  let whereClause = "";

  if (type === "monthly" && get_by_type === "All") {
    whereClause = `AND YEAR(createtime) = ${current_year} AND MONTH(createtime) = ${current_month}`;
  } else if (type === "yearly" && get_by_type === "All") {
    whereClause = `AND YEAR(createtime) = ${current_year}`;
  }

  const query = `SELECT user_id FROM user_master WHERE  delete_flag = 0 AND user_type = 2 ${whereClause} AND profile_completed = 1 ORDER BY user_id DESC`;

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Database query error:", error);
      reject(error); // Reject the promise with the error
      return;
    }

    const userCount = rows.length > 0 ? rows.length : 0;
    resolve(userCount); // Resolve the promise with the count of rows
  });
});
}

const getCustomerClamied = async (request,response) => {
  const {customer_id} = request.query;
  try {
    if (!customer_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "customer_id"}
      return response.json(record);
    }
   
    var sqlSelect = "SELECT claim_id, customer_id, user_id, description, file,file_type, approved_status FROM claim_master WHERE customer_id = ? AND delete_flag = 0;";
    connection.query(sqlSelect,[customer_id],async(error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,clamied_data:result});
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}


const getUserAllSubscription = async (request,response) => {
  try {
    var sqlSelect = "SELECT usm.user_subscription_id, usm.user_id,	usm.subscription_type, usm.subscription_id, usm.amount, usm.start_date, usm.end_date, usm.transaction_id, usm.status, usm.duration, usm.createtime, um.f_name,um.l_name FROM user_subscription_master as usm JOIN user_master as um ON usm.user_id = um.user_id WHERE um.delete_flag = 0 AND usm.delete_flag =0";
    connection.query(sqlSelect,async(err,result) => {
      if (err) {

        return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: err.message });
        
      }
      var subscription_arr = [];
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;
          subscription_arr.push({
            s_no : s_no,
            user_subscription_id : data.user_subscription_id,
            user_id : data.user_id,
            subscription_type : data.subscription_type,
            subscription_type_lable :  data.subscription_type == 1 ? 'Free' : data.subscription_type == 2 ? 'Primium' : 'Standard',
            subscription_id : data.subscription_id,
            amount : data.amount,
            start_date : moment(data.start_date).format("DD-MM-YYYY"),
            end_date :  moment(data.end_date).format("DD-MM-YYYY"),
            transaction_id : data.transaction_id,
            status : data.status,
            name : data.f_name + " " +data.l_name,
            status_lable : data.status == 1 ? 'Active' : data.status == 2 ? 'Cancel' : 'Expired',
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY"),
          })

        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, result:(subscription_arr.length > 0) ? subscription_arr : []})
      } else {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, result:(subscription_arr.length > 0) ? subscription_arr : []})
      }
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}


const getBusinessAnalyticalReportsClaims = async (req, res) => {

  const data = req.query;

  if (!data) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  } else if (!data.action) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  }

  else if (data.action !== 'get_business_analytical_report') {

   return res.status(200).json({
     status: true,
     msg: languageMessages.msg_empty_param,
     key: "from_date",
   });

  } else {




      try {
          const month_report_arr = [];
          const year_report_arr = [];
          const month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const current_year = new Date().getFullYear();

          for (let i = 0; i < month_arr.length; i++) {
              const month_text = month_arr[i];
              const current_month = i + 1;
              const month_user_arr = await getBusinessAnalyticalReportsDataClaims(
                "monthly",
                current_year,
                current_month,
                "All"
              );
              month_report_arr.push({ month: month_text, month_user_arr: month_user_arr });
          }

          for (let i = 2020; i <= current_year; i++) {
              const year_user_arr = await getBusinessAnalyticalReportsDataClaims(
                "yearly",
                i,
                "",
                "All"
              );
              year_report_arr.push({ year: i, year_user_arr: year_user_arr });
          }

          const record = {
            success: true,
            msg: languageMessages.msgDataFound,
            data: { month_report_arr, year_report_arr },
          };
          return res.json(record);

      } catch (error) {
          console.log("database error key 2:", error);
          const record = { success: false, msg: languageMessages.internalServerError, key: error };
          return res.json(record);
      }

  }

};
function getBusinessAnalyticalReportsDataClaims(
type,
current_year,
current_month,
get_by_type
) {
// console.log("current_month:", current_month);

return new Promise((resolve, reject) => {
  let whereClause = "";

  if (type === "monthly" && get_by_type === "All") {
    whereClause = `AND YEAR(cm.createtime) = ${current_year} AND MONTH(cm.createtime) = ${current_month}`;
  } else if (type === "yearly" && get_by_type === "All") {
    whereClause = `AND YEAR(cm.createtime) = ${current_year}`;
  }

  const query = `SELECT cm.user_id FROM customer_master as cm JOIN user_master as um ON cm.user_id = um.user_id WHERE  cm.delete_flag = 0 AND um.delete_flag = 0 ${whereClause} ORDER BY cm.user_id DESC`;

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Database query error:", error);
      reject(error); 
      return;
    }

    const userCount = rows.length > 0 ? rows.length : 0;
    resolve(userCount); 
  });
});
}

const getTabularSubscription = async (request,response) => {
  const {from_date,to_date} = request.query;
  try {
    if(!from_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }
    var sqlSelect = `SELECT usm.user_subscription_id, usm.user_id,usm.subscription_type, usm.subscription_id, usm.amount, usm.start_date, usm.end_date, usm.transaction_id, usm.status, usm.duration, usm.createtime, um.f_name,um.l_name FROM user_subscription_master as usm JOIN user_master as um ON usm.user_id = um.user_id WHERE um.delete_flag = 0 AND usm.delete_flag = 0 AND Date(usm.createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;
    connection.query(sqlSelect, [from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,err: err.message});
      }
      var subscription_arr = [];
      if (result.length <= 0) {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,subscription_arr: subscription_arr});
      }
      var s_no = 0;
      if (result.length > 0) {
        for (var data of result) {
          s_no++;
          subscription_arr.push({
            s_no : s_no,
            user_subscription_id : data.user_subscription_id,
            user_id : data.user_id,
            subscription_type : data.subscription_type,
            subscription_type_lable :  data.subscription_type == 1 ? 'Free' : data.subscription_type == 2 ? 'Primium' : 'Standard',
            subscription_id : data.subscription_id,
            amount : data.amount,
            start_date : moment(data.start_date).format("DD-MM-YYYY"),
            end_date :  moment(data.end_date).format("DD-MM-YYYY"),
            transaction_id : data.transaction_id,
            status : data.status,
            name : data.f_name + " " +data.l_name,
            status_lable : data.status == 1 ? 'Active' : data.status == 2 ? 'Cancel' : 'Expired',
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY"),
          });
        }

        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,subscription_arr: subscription_arr.length > 0 ? subscription_arr : "NA"});
      };
    })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,err: error.message});
  }
}



const getSubscriptionAnalyticalReports = async (req, res) => {
  const data = req.query;
  if (!data) {
    return res.status(200).json({status: true,msg: languageMessages.msg_empty_param,key: "from_date"});
  } else if (!data.action) {
    return res.status(200).json({status: true,msg: languageMessages.msg_empty_param,key: "from_date"});
  }
  else if (data.action !== 'get_business_analytical_report') {
   return res.status(200).json({status: true,msg: languageMessages.msg_empty_param,key: "from_date"});
  } else {
    try {
      const month_report_arr = [];
      const year_report_arr = [];
      const month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const current_year = new Date().getFullYear();
      for (let i = 0; i < month_arr.length; i++) {
        const month_text = month_arr[i];
        const current_month = i + 1;
        const month_user_arr = await getSubscriptionAnalyticalReportsData("monthly",current_year,current_month,"All");
          month_report_arr.push({ month: month_text, month_user_arr: month_user_arr });
        }
      for (let i = 2020; i <= current_year; i++) {
        const year_user_arr = await getSubscriptionAnalyticalReportsData("yearly",i,"","All");
          year_report_arr.push({ year: i, year_user_arr: year_user_arr });
        }
        const record = {success: true,msg: languageMessages.msgDataFound,data: { month_report_arr, year_report_arr }};
        return res.json(record);

      } catch (error) {

      const record = { success: false, msg: languageMessages.internalServerError, key: error };
      return res.json(record);
    }
  }
};
function getSubscriptionAnalyticalReportsData(type,current_year,current_month,get_by_type) {
return new Promise((resolve, reject) => {
  let whereClause = "";
  if (type === "monthly" && get_by_type === "All") {
    whereClause = `AND YEAR(usm.createtime) = ${current_year} AND MONTH(usm.createtime) = ${current_month}`;
  } else if (type === "yearly" && get_by_type === "All") {
    whereClause = `AND YEAR(usm.createtime) = ${current_year}`;
  }
  const query = `SELECT usm.user_id FROM user_subscription_master as usm JOIN user_master as um ON usm.user_id = um.user_id WHERE usm.delete_flag = 0 AND um.delete_flag = 0 ${whereClause} ORDER BY usm.user_id DESC`;
  connection.query(query, (error, rows) => {
    if (error) {
      reject(error); 
      return;
    }
    const userCount = rows.length > 0 ? rows.length : 0;
    resolve(userCount); 
  });
});
}

const getDeletedCustomer = async (request,response) => {
  const {user_id} = request.params;
  try {
    if (!user_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "user_id" });
    }
    var sqlSelect = "SELECT customer_id, user_id, f_name, l_name, name, phone_code, mobile, email, address, file, file_type, description, delete_question_1, delete_question_1_desc, delete_question_2, delete_question_2_desc, delete_docs, delete_desc_type, delete_flag, createtime, updatetime, mysqltime FROM customer_master WHERE user_id = ? AND delete_flag = 1";
    connection.query(sqlSelect,[user_id],async (error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      var customer_arr = [];
      if(result.length <= 0) {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, customer_arr : customer_arr});
      }
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;

          customer_arr.push({
            s_no: s_no,
            user_id: data.user_id,
            customer_id : data.customer_id,
            f_name: data.f_name,
            l_name: data.l_name,
            email: data.email,
            mobile : data.mobile,
            address :data.address,
            createtime : moment(data.createtime).format("DD-MM-YYYY HH:mm A") 
          })
        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, customer_arr : customer_arr});
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
}

const getDeletedCustomerQuestionAnswer = async (request,response) => {
  const {customer_id} = request.params;
  try {
    if (!customer_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "customer_id"}
      return response.json(record);
    }
    var question_arr = [];
    var sqlSelect = "SELECT customer_answer_id, customer_question_id, customer_id, answer, question_type, answer_2, date,createtime FROM customer_answer_master WHERE customer_id = ?";
    connection.query(sqlSelect,[customer_id],async(error,result) => {
      if (error) {
        return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
      }
      if(result.length > 0) {
        for(var data of result) {
          question_arr.push({
            customer_answer_id : data.customer_answer_id,
            customer_question_id : data.customer_question_id,
            question : await getQuestion(data.customer_question_id),
            customer_id : data.customer_id,
            answer  : data.answer,
            question_type : data.question_type,
            date : moment(data.date).format("DD-MM-YYYY ") ,
            answer_2 : data.answer_2,
            createtime : moment(data.createtime).format("DD-MM-YYYY"),
          })
        }
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, question_arr:question_arr})
      } else {
        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, question_arr:question_arr})
      }
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}


const getAllCustomerClamied = async (request,response) => {
  const {user_id} = request.query;
  try {
    if (!user_id){
      const record = { success: false, msg: languageMessages.msg_empty_param, key: "user_id"}
      return response.json(record);
    }
   
    var sqlSelect = "SELECT um.business_name, cm.createtime, cms.f_name, cms.l_name, cms.mobile, cms.email, cms.user_id AS customer_user_id, cm.claim_id, cm.customer_id, cm.user_id AS claim_user_id, cm.description, cm.file, cm.approved_status FROM claim_master AS cm JOIN customer_master AS cms ON cm.customer_id = cms.customer_id JOIN user_master AS um ON um.user_id = cms.user_id WHERE cm.user_id = ? AND cm.delete_flag = 0 AND um.delete_flag = 0;";
    connection.query(sqlSelect,[user_id],async(error,result) => {
      if (error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
      }
      var clamied_data = [];
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;
          clamied_data.push({
            s_no : s_no,
            business_name : data.business_name,
            customer_id : data.customer_id,
            f_name : data.f_name,
            l_name : data.l_name,
            approved_status : data.approved_status,
            mobile : data.mobile,
            approved_status_lable : data.status == 0 ? 'Pending' : 'Approved',
            duration : data.duration,
            createtime : moment(data.createtime).format("DD-MM-YYYY"),
          })

        }
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,clamied_data:clamied_data});
      } else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,clamied_data:clamied_data});
      }
    })
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, err: error.message });
  }
}


const CustomerStatusVerfy = async (request, response) => {
  const { user_id} = request.body;
  if (!user_id) {
    return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'user_id' });
  }
  try {
    const updateUserQuery = "UPDATE claim_master SET approved_status = 1 WHERE customer_id  = ?";
      connection.query(updateUserQuery, [user_id], async (err, result) => {
        if (err) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : err.message  });
        }
        try {   
          return response.status(200).json({ success: true, msg: languageMessages.EmailSent });
        } catch (error) {
        return response.status(200).json({ success: false, msg: "Failed to customer verify email" });
      }
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
};


const getAdds = async (request,response) => {
  try {
    var sqlSelect = "SELECT ads_id, video, thumbnail_image, discount, createtime FROM ads_master WHERE delete_flag = 0 order by ads_id desc";
    connection.query(sqlSelect,async (error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message });
      }
      var add_arr = [];
      var s_no = 0;
      if(result.length > 0) {
        for(var data of result) {
          s_no++;
          add_arr.push({
            s_no : s_no,
            ads_id : data.ads_id,
            video : data.video,
            thumbnail_image : data.thumbnail_image,
            discount : data.discount,
            createtime :  moment(data.createtime).format("DD-MM-YYYY HH:MM A"),
          })
        }
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,add_arr:add_arr});
      } else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,add_arr:add_arr});
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
}

const addAds = async (request,response) => {
  const {points} = request.body;
  try {
    if(!points) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : request.body});
    }

    var thumbnail_image = request.files["image"];
    var video = request.files["video"];
    if(!thumbnail_image) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'thumbnail_image' });
    }
    if(!video) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'video' });
    }

    var sqlSelect = "INSERT INTO ads_master(video, thumbnail_image, discount, createtime, updatetime) VALUES (?,?,?,now(),now())";
    connection.query(sqlSelect,[video[0].filename,thumbnail_image[0].filename,points],async (error,addResult) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message });
      }
      if(addResult.affectedRows > 0) {
        return response.status(200).json({success: true,msg: languageMessages.adsAddSuccess});
      } else {
        return response.status(200).json({success: false,msg: languageMessages.adsAddUnSuccess});

      }
    })
    if(!video) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'video' });
    }
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
}


const deleteAds = async (request,response) => {
  const {ads_id} = request.body;
  try {
      if(!ads_id) {
        return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'ads_id'});
      }
      var sqlDelete = "UPDATE ads_master SET delete_flag = 1 WHERE ads_id = ? AND delete_flag = 0";
      connection.query(sqlDelete,[ads_id],async (error,resultAdsDelete) => {
        if(error) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message });
        }
        if(resultAdsDelete.affectedRows > 0) {
          return response.status(200).json({success: true,msg: languageMessages.adsDeleteSuccess});
        } else {
          return response.status(200).json({success: false,msg: languageMessages.adsDeleteUnSuccess});
  
        }
      })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
}

const getAdsDetails = async (request,response) => {
  const {ads_id} = request.query;
  try {
    if(!ads_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'ads_id'});
    }
    var sqlSelect = "SELECT ads_id, video, thumbnail_image, discount, createtime FROM ads_master WHERE delete_flag = 0 AND ads_id = ?";
    connection.query(sqlSelect,[ads_id],async (error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message });
      }
      if(result.length > 0) {
        var data = result[0];
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,add_arr:{ads_id : data.ads_id,video : data.video,thumbnail_image : data.thumbnail_image,discount : data.discount,createtime :  moment(data.createtime).format("DD-MM-YYYY HH:MM A")}});
      } else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,add_arr:{}});
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
}

const editAds = async (request,response) => {
  const {ads_id,points} = request.body;
  try {
    if(!ads_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'ads_id'});
    }
    if(!points) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'points'});
    }
    var thumbnail_image = request.files["image"];
    var video = request.files["video"];
    var updatesql = "";
    var values = [];
    if(!thumbnail_image && !video) {
      updatesql = "UPDATE ads_master SET discount = ?, updatetime = now() WHERE ads_id = ? AND delete_flag = 0";
      values = [points,ads_id];
    } else if (!thumbnail_image) {
      updatesql = "UPDATE ads_master SET video = ?, discount = ?, updatetime = now() WHERE ads_id = ? AND delete_flag = 0";
      values = [video[0].filename,points,ads_id];
    } else  if (!video){
      updatesql = "UPDATE ads_master SET thumbnail_image = ?, discount = ?, updatetime = now() WHERE ads_id = ? AND delete_flag = 0";
      values = [thumbnail_image[0].filename,points,ads_id];
    } else {
      updatesql = "UPDATE ads_master SET video = ?, thumbnail_image = ?, discount = ?, updatetime = now() WHERE ads_id = ? AND delete_flag = 0";
      values = [video[0].filename,thumbnail_image[0].filename,points,ads_id];
    }
    connection.query(updatesql,values,async (error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
      }
      if(result.affectedRows > 0) {
        return response.status(200).json({ success: true, msg: languageMessages.addUpdateSuccess }); 
      } else {
        return response.status(200).json({ success: false, msg: languageMessages.addUpdateUnSuccess }); 
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
  }
}

const getBanner = async (request,response) => {
  try {
    var sqlSelect = "SELECT banner_id, image, DATE_FORMAT(createtime, '%d-%m-%Y %h:%i %p') as createtime_format  FROM banner_master WHERE delete_flag = 0 order by banner_id desc";
    connection.query(sqlSelect,async (error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
      }
      return response.status(200).json({ success: true, msg: languageMessages.msgDataFound,banner_arr : result }); 
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
  }
}

const addBanner = async (request,response) => {
  try {
    var images = request.files["image"];
    if(!images) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'images'});
    }
    var sqlInsert = "INSERT INTO banner_master(image,createtime,updatetime) VALUES (?,now(),now())";
    connection.query(sqlInsert,[images[0].filename],(error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
      }
      if(result.affectedRows > 0) {
        return response.status(200).json({success : true,msg : languageMessages.bannerAddedSuccesfully})
      } else {
        return response.status(200).json({success : false,msg : languageMessages.bannerAddedUnSuccesfully})
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
  }
}

const deleteBanner = async (request,response) => {
  const {banner_id} = request.body;
  try {
    if(!banner_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'banner_id'});
    }
    var sqlDelete = "DELETE FROM banner_master WHERE delete_flag = 0 AND banner_id = ?";
    connection.query(sqlDelete,[banner_id],async (error,deleteResult) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
      }
      if(deleteResult.affectedRows > 0) {
        return response.status(200).json({success : true,msg : languageMessages.bannerDeletedSuccesfully})
      } else {
        return response.status(200).json({success : false,msg : languageMessages.bannerDeletedUnSuccesfully})
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
  }
}

const editBanner = async (request,response) => {
  const {banner_id} = request.body;
  try {
    if(!banner_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'banner_id'});
    }
    var image = request.files["image"];
    if(image) {
      var sqlUpdate = "UPDATE banner_master SET image = ?, updatetime = now() WHERE banner_id = ? AND delete_flag = 0";
      connection.query(sqlUpdate,[image[0].filename,banner_id],async (error,result) => {
        if(error) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
        }
        if(result.affectedRows > 0) {
          return response.status(200).json({success : true,msg : languageMessages.bannerEditSuccessfully})
        } else {
          return response.status(200).json({success : false,msg : languageMessages.bannerEditUnSuccessfully})
        }
      })
    } else {
      return response.status(200).json({success : true,msg : languageMessages.bannerEditSuccessfully})
    }
    
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  }); 
  }
}


const check = async( req, res ) => {
      res.status(200).json({
        success: true,
        msg: "Check All is Working....",
        key: "Abhi",
      })

}

const getAllDetails = async(request, response) =>{
 
  const { user_id } = request.params;

  
  if (!user_id) {
    return response.status(200).json({
      success: false,

      msg: languageMessages.msg_empty_param,

      key: "hey",
    });
  }else{
    return response.status(200).json({
        success: true,
        msg: user_id,
       })
    
  }


}


const getAllGuardData = async (request, response) => {
  try {
    const sqlCheckUser = `
  SELECT 
    u.user_id, 
    u.f_name, 
    u.l_name, 
    u.name, 
    u.mobile, 
    u.email, 
    u.role,  
    u.password, 
    u.active_flag,  
    u.createtime, 
    u.updatetime, 
    u.society_name, 
    b.building_name
  FROM user_master u
  LEFT JOIN building_master b ON u.building_id = b.building_id
  WHERE u.delete_flag = 0 
    AND u.user_type = 2
  ORDER BY u.user_id DESC;
`;

    connection.query(sqlCheckUser, async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            
            s_no: s_no,

            password: data.password,

            user_id: data.user_id,

            f_name: data.f_name,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            mobile: data.mobile,

            society_name: data.society_name,

            building_name: data.building_name,

           role: data.role,
           
            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};


const addNewGuard = async (request,response) => {

  
  const {  name, mobile, email, society_id, building_id, role, password, timing } = request.body;

  let image = request.file ? request.file.filename : null;

  try {
    if (!name) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "name"});
    }

    if (!mobile) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "number"});
    }
    if(!society_id){
      return response.status(200).json({success:false, msg: languageMessages.msg_empty_param, key: "Socieyty"});
    }
    if(!email){
      return response.status(200).json({success: false, msg: languageMessages.msg_empty_param, key: "society_name"});
    }
    if(!building_id){
      return response.status.json({success: false, msg: languageMessages.msg_empty_param, key: "building_id Name"});
    }
    if(!role){
      return response.status(200).json({success: false, mgs: languageMessages.msg_empty_param, key: "Role"});

    }
    if(!password){
      return response.status(200).json({success: false, msg:languageMessages.msg_empty_param, key: "Password"});
    }
 

    
    // const checkDuplicateName = "SELECT guard_id, name, email, number, createtime FROM guard_master WHERE delete_flag = 0 AND LOWER(email) = LOWER(?);";

    // connection.query(checkDuplicateName,[email],(duplicateErr, duplicateRes) => {

    //   if (duplicateErr) {
    //     return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
    //   }

    //   if (duplicateRes.length > 0) {
    //     return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "GuardAlreadyExist" });
    //   }

      const user = 2;
      const insertQuestion ="INSERT INTO user_master(user_type, name, mobile, email, society_id, building_id, role, password, image, createtime, updatetime) VALUES (?,?,?,?,?,?,?,?,?, now(),now())";

      connection.query(insertQuestion, [user, name, mobile, email, society_id, building_id, role, password, image], async(updateError, result) => {

        if (updateError) {

          return response.status(200).json({success: false,msg: languageMessages.internalServerError,updateError: updateError.message});

        }

        if (result.affectedRows <= 0) {

          return response.status(200).json({success: false,msg: languageMessages.errorUpdating});

        }



        // if (affectedRows > 0) {

        //   const subject = "Guard Info";

        //   const app_name = process.env.APP_NAME;

        //   const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";

        //   const mailBody = mailBodyNewGuardAdd({

        //     name,

        //     password,

        //     app_name,

        //     app_logo,
        //   });

        //   try {
        //     const mailResponse = await NewGuardAddEmail(
        //       email,

        //       subject,

        //       mailBody
        //     );

        //     if (mailResponse.success) {
        //       return response

        //         .status(200)

        //         .json({ 
        //           success: true, 
        //           email: languageMessages.EmailSent,
        //           msg: languageMessages.FaqAddSucessfully,
                
        //         });
        //     } else {
        //       return response.status(200).json({
        //         success: false,

        //         msg: "Error sending email",

                
        //       });
        //     }
        //   } catch (error) {
        //     console.error("Error sending email:", error);

        //     return response.status(200).json({
        //       success: false,

        //       msg: "Failed to send email ",
        //     });
        //   }
        // } else {
        //   return response

        //     .status(200)

        //     .json({ success: false, msg: "Failed to update user status" });
        // }



      return response.status(200).json({success: true, msg: languageMessages.FaqAddSucessfully});

    }); 

  // })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "4",error : error.message});
  }
}


const deleteGuard = async (request, response) => {

  const { user_id } = request.body;

  try {

    if (!user_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "user_id"});
    }

    var sqlSelect = "SELECT user_id, createtime FROM user_master WHERE delete_flag = 0 AND user_id = ?";
    connection.query(sqlSelect, [user_id], async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound});
      }

      if (result.length > 0) {
        var updateSql = "UPDATE user_master set delete_flag = 1 , updatetime = now() where delete_flag = 0 AND user_id = ?";
        connection.query(updateSql, [user_id], (err, updateQuestion) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }
          if (updateQuestion.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Error deleteing guard" });
          }
          if (updateQuestion.affectedRows > 0) {
            return response.status(200).json({success: true,msg: languageMessages.deleteGuardSuccess});
          }
        });
      }
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message});
  }
};


const getguardDetails = async (request,response) => {
  
  const { user_id } = request.query;
  try {
    if(!user_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param,key : 'user_id'});
    }
    var sqlSelect =  `
    SELECT 
      u.user_id, 
      u.f_name,
      u.society_id,
      u.building_id, 
      u.l_name,
      u.shift,
      u.name, 
      u.mobile, 
      u.email, 
      u.role,  
      u.password, 
      u.active_flag,  
      u.createtime, 
      u.updatetime, 
      u.society_name, 
      b.building_name
    FROM user_master u
    LEFT JOIN building_master b ON u.building_id = b.building_id
    WHERE u.delete_flag = 0 
      AND u.user_type = 2
      AND user_id = ?;
  `;
   
    connection.query(sqlSelect,[user_id],async (error,result) => {
      if(error) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message });
      }
      if(result.length > 0) {
        var data = result[0];
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          add_arr:{

           
            user_id: data.user_id,

            name : data.name,

            email: data.email,

            mobile: data.mobile,

            society_id : data.society_id,

            building_id : data.building_id,

            society_name: data.society_name,

            building_name: data.building_name,

            role: data.shift,

            password: data.password,
            
            shift: data.shift,

            
            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          
          
          }});
      } else {
        return response.status(200).json({success: true,msg: languageMessages.msgDataFound,add_arr:{}});
      }
    })
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error : error.message  });
  }
}


const editGuard = async (request, response) => {
  const { user_id, name, mobile, email, building_id } = request.body;
  let image = request.file ? request.file.filename : null;

  try {
    // Helper function to return error responses
    const sendErrorResponse = (msg, key) => {
      return response.status(200).json({ success: false, msg, key });
    };

    // Input validation
    if (!user_id) return sendErrorResponse(languageMessages.msg_empty_param, "user_id");
    if (!name) return sendErrorResponse(languageMessages.msg_empty_param, "name");
    if (!mobile) return sendErrorResponse(languageMessages.msg_empty_param, "mobile");
    if (!email) return sendErrorResponse(languageMessages.msg_empty_param, "email");
    if (!building_id) return sendErrorResponse(languageMessages.msg_empty_param, "building_id");

    // Check if the guard exists
    const checkCategory = `
      SELECT user_id, name, mobile, email, building_id, image, createtime, updatetime, mysqltime 
      FROM user_master 
      WHERE delete_flag = 0 AND user_id = ?
    `;

    connection.query(checkCategory, [user_id], (err, res) => {
      if (err) {
        return sendErrorResponse(languageMessages.internalServerError, "database_error");
      }
      if (res.length === 0) {
        return sendErrorResponse(languageMessages.msgDataNotFound, "guard_not_found");
      }

      // Check for duplicate email
      const checkDuplicateEmail = `
        SELECT user_id 
        FROM user_master 
        WHERE delete_flag = 0 AND LOWER(email) = LOWER(?) AND user_id != ?
      `;

      connection.query(checkDuplicateEmail, [email, user_id], (duplicateErr, duplicateRes) => {
        if (duplicateErr) {
          return sendErrorResponse(languageMessages.internalServerError, "database_error");
        }
        if (duplicateRes.length > 0) {
          return sendErrorResponse(languageMessages.msgDataFound, "duplicate_email");
        }

        // Update guard details
        const updateCategory = `
          UPDATE user_master 
          SET name = ?, mobile = ?, email = ?, building_id = ?, image = IFNULL(?, image) 
          WHERE delete_flag = 0 AND user_id = ?
        `;

        connection.query(updateCategory, [name, mobile, email, building_id, image, user_id], (updateError, result) => {
          if (updateError) {
            return sendErrorResponse(languageMessages.internalServerError, "database_error");
          }
          if (result.affectedRows <= 0) {
            return sendErrorResponse(languageMessages.errorUpdating, "update_failed");
          }
          return response.status(200).json({ success: true, msg: languageMessages.DetailsUpdated });
        });
      });
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message, key: "unexpected_error" });
  }
};





const getAllbuilding = async (req, res) => {
  try {
    const sqlSelect = `
         
          SELECT 
              bm.building_id,
              bm.building_name,
              bm.createtime,
              um.society_name
              FROM building_master bm
              JOIN user_master um ON bm.society_id = um.user_id
              WHERE bm.delete_flag = 0
              ORDER BY bm.building_id DESC 
    `
    
    connection.query(sqlSelect, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
        });
      }

      if (!result || result.length === 0) {
        return res.status(200).json({
          success: false,
          msg: "No buildings found",
          building_arr: [],
        });
      }

      const buildingArr = result.map((data, index) => ({
        s_no: index + 1,
        building_id: data.building_id,
        building_name: data.building_name,
        society_name: data.society_name,
        createtime: data.createtime
          ? moment(data.createtime).format("DD-MM-YYYY HH:mm A")
          : null,
      }));

      return res.status(200).json({
        success: true,
        msg: "Buildings fetched successfully",
        building_arr: buildingArr,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
    });
  }
};


const deletebuilding = async (request, response) => {

  const { building_id } = request.body;

  // response.send("Hello");

  try {

    if (!building_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "building_id"});
    }

    var sqlSelect = "SELECT building_id, building_name, createtime FROM building_master WHERE delete_flag = 0 AND building_id = ?";
    connection.query(sqlSelect, [ building_id ], async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound});
      }

      if (result.length > 0) {
        var updateSql = "UPDATE building_master set delete_flag = 1 , updatetime = now() where delete_flag = 0 AND building_id = ?";
        connection.query(updateSql, [building_id], (err, updateQuestion) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }
          if (updateQuestion.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Error deleteing Building" });
          }
          if (updateQuestion.affectedRows > 0) {
            return response.status(200).json({success: true,msg: languageMessages.deleteFaqSuccess});
          }
        });
      }
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message});
  }
};


const addBuilding = async (req, res) => {
  
 
  const { building_name } = req.body;
  

  try {
    if (!building_name) {
      return res.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "building_name is Missing",
      });
    }

    const checkDuplicateName =
      "SELECT building_id FROM building_master WHERE delete_flag = 0 AND LOWER(building_name) = LOWER(?)";

    connection.query(checkDuplicateName, [building_name], (duplicateErr, duplicateRes) => {
      if (duplicateErr) {
        console.error("Database Error:", duplicateErr);
        return res.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          key: "DB_ERROR_DUPLICATE_CHECK",
        });
      }

      if (duplicateRes.length > 0) {
        return res.status(200).json({
          success: false,
          msg: "Building already exists",
          key: "BuildingAlreadyExist",
        });
      }

      const insertBuilding =
        "INSERT INTO building_master (building_name, createtime, updatetime) VALUES (?, NOW(), NOW())";

      connection.query(insertBuilding, [building_name], (insertErr, result) => {
        if (insertErr) {
          console.error("Insert Error:", insertErr);
          return res.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            error: insertErr.message,
          });
        }

        if (result.affectedRows <= 0) {
          return res.status(200).json({
            success: false,
            msg: "Failed to add building",
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Building added successfully",
          building_id: result.insertId, // Returning the new building ID
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    });
  }
};


const editBuilding = async (request,response) => {
  
  const { building_id, building_name } = request.body;

  try {
    if (!building_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "Building_ID is Missing"});
    }

    if (!building_name) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "building_name is Missing"});
    }

    // if (!answer) {
    //   return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "answer"});
    // }

    const checkCategory = "SELECT building_id building_name, createtime FROM building_master WHERE delete_flag = 0 AND building_id = ?";
    connection.query(checkCategory, [building_id], (err, res) => {
      if (err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "1"});
      }
      if (res.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "faqNotFound"});
      }

      const checkDuplicateName = "SELECT building_id, building_name FROM building_master WHERE delete_flag = 0 AND LOWER(building_name) = LOWER(?) AND building_id != ?";
      connection.query(checkDuplicateName,[building_name, building_id],(duplicateErr, duplicateRes) => {
          if (duplicateErr) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
          }
          if (duplicateRes.length > 0) {
            return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "faqAlreadyExist"});
          }

        const updateCategory = "UPDATE building_master set building_name = ?, updatetime = now()  WHERE delete_flag = 0 AND building_id = ?";
        connection.query(updateCategory,[building_name, building_id],async (updateError, result) => {
            if (updateError) {
              return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "3"});
            }
            if (result.affectedRows <= 0) {
              return response.status(200).json({success: false,msg: languageMessages.errorUpdating});
            }
          return response.status(200).json({success: true,msg: languageMessages.DetailsUpdated});
        });
      });
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message,key: "4"});
  }
}

const getallSociety = async(request, response) => {
  try{
    var sqlSelect = "SELECT user_id, user_type, email, society_name,location, createtime FROM user_master WHERE user_type = 3 AND delete_flag = 0 order by user_id desc";
    connection.query(sqlSelect, async(err, result) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
        });
      }
      var society_arr = [];
      if(result.length === 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          society_arr: society_arr
        });
      }
      var s_no = 0;
      for(var data of result){
        s_no++;
        society_arr.push({
          s_no: s_no,
          user_id: data.user_id,
          society_name: data.society_name,
          location: data.location,
          email: data.email,
          createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
        });
      }

      return response.status(200).json({
        success: true,
        msg: languageMessages.msgDataFound,
        society_arr: society_arr,
      });
    });

  }catch(error){
    return response.status(200).json({
      success: true,
      msg: languageMessages.internalServerError,
      key: "catch",
    })
  }
}

const deleteSocity = async (request, response) => {
  const { user_id } = request.body;

  try{
    if(!user_id){
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "User_id Missing",
      })
    }

    var sqlSelect = "SELECT user_id, society_name, createtime from user_master WHERE delete_flag = 0 AND user_id = ?";
    connection.query(sqlSelect, [user_id], async(err, result) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          key: err.message,
        })

      }
      if(result.length === 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          
        })
      }
      if(result.length > 0)
      {
        var updateSql = "UPDATE user_master set delete_flag = 1, updatetime = now() where delete_flag = 0 AND user_id = ?";
        connection.query(updateSql, [user_id], async(err, updatesociety) => {
          if(err){
            return response.status(200).json({
              success: false,
              msg: languageMessages.internalServerError,
            })
          }
          if(updatesociety.affectedRows <= 0){
            return response.status(200).json({
              success: false,
              msg:"Not Able to delete",
            })
          }
          if(updatesociety.affectedRows > 0){
            return response.status(200).json({
              success: true,
              msg: "Society Deleted Success",
            })
          }
        })
      }
    })


  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: error.message,
    });
  }

}


const getTotalSocietysCount = async (request, response) => {
  try{
    // SELECT COUNT(*) AS total_societies FROM society_master WHERE delete_flag = 0;

  var sqlSelect = "SELECT count(user_id) as society_count FROM user_master WHERE delete_flag = 0 AND user_type = 3 AND active_flag = 1"

  // const sqlcheckGuard = "";
  connection.query(sqlSelect, async(error, result) => {
    if(error){
      return response.status(200).json({
        success: false,
        msg: languageMessages.internalServerError,
        err: error.message,
      })
    }
    if(result.length === 0) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msgDataNotFound,
        // err: error.message,
      })
    }
    if(result.length > 0){
      return response.status(200).json({
        success: true,
        msg: languageMessages.msgDataFound,
        result: result, 
      })

    }

  })
  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    })
  }
}


const editSociety = async (request,response) => {

  const { society_id, society_name } = request.body;

  try {
    if (!society_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "society_id"});
    }

    if (!society_name) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "society_name"});
    }

    const checkCategory = "SELECT society_id society_name, createtime FROM society_master WHERE delete_flag = 0 AND society_id = ?";
    connection.query(checkCategory, [society_id], (err, res) => {
      if (err) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "1"});
      }
      if (res.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "faqNotFound"});
      }

      const checkDuplicateName = "SELECT society_id, society_name FROM society_master WHERE delete_flag = 0 AND LOWER(society_name) = LOWER(?) AND society_id != ?";
      connection.query(checkDuplicateName,[society_name,society_id],(duplicateErr, duplicateRes) => {
          if (duplicateErr) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
          }
          if (duplicateRes.length > 0) {
            return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "faqAlreadyExist"});
          }

        const updateCategory = "UPDATE society_master set society_name = ?, updatetime = now()  WHERE delete_flag = 0 AND society_id = ?";
        connection.query(updateCategory,[society_name,society_id],async (updateError, result) => {
            if (updateError) {
              return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "3"});
            }
            if (result.affectedRows <= 0) {
              return response.status(200).json({success: false,msg: languageMessages.errorUpdating});
            }
          return response.status(200).json({success: true,msg: languageMessages.DetailsUpdated});
        });
      });
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message,key: "4"});
  }
}

const getSocietyNameDropdown = async(request, response) => {
  try{
    sqlSelect = "SELECT society_id, society_name from society_master WHERE delete_flag = 0";
    connection.query(sqlSelect, async(error, result) => {
      if(error){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          error: error.message,
        })
      }
      if(result.length <= 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataNotFound,
        })
      }
      if(result.length > 0){
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          result: result,
        })
      }
    })

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    })
  }
}


const getBuildingNameDropdown = async(request, response) => {
  try{
    sqlSelect = "SELECT building_id, building_name from building_master WHERE delete_flag = 0";
    connection.query(sqlSelect, async(error, result) => {
      if(error){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          error: error.message,
        })
      }
      if(result.length <= 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataNotFound,

        })
      }
      if(result.length > 0){
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          result: result,
        })
      }
    });

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    })
  }
}


const addNewSocietyName = async (request,response) => {
  
  const { society_name } = request.body;

  try {
    if (!society_name) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "society_name"});
    }

    const checkDuplicateName = "SELECT society_id, society_name, createtime FROM society_master WHERE delete_flag = 0 AND LOWER(society_name) = LOWER(?);";

    connection.query(checkDuplicateName,[society_name],(duplicateErr, duplicateRes) => {

      if (duplicateErr) {
        return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "2"});
      }

      if (duplicateRes.length > 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound,key: "FaqAlreadyExist" });
      }

      const insertQuestion ="INSERT INTO society_master(society_name,createtime,updatetime) VALUES (?,now(),now())";

      connection.query(insertQuestion, [society_name],(updateError, result) => {

        if (updateError) {

          return response.status(200).json({success: false,msg: languageMessages.internalServerError,updateError: updateError.message});

        }

        if (result.affectedRows <= 0) {

          return response.status(200).json({success: false,msg: languageMessages.errorUpdating});

        }
      return response.status(200).json({success: true, msg: languageMessages.FaqAddSucessfully});

    }); 

  })
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,key: "4",error : error.message});
  }
}



const getAllQuizQuestion = async (request, response) => {
  try {
    const sqlQuery = `
      SELECT 
        q.question_id, 
        q.question, 
        q.createtime,
        q.answer_id AS correct_answer_id, 
        ca.answer AS correct_answer,  -- Fetching the correct answer text
        a.answer_id, 
        a.answer
      FROM question_master q 
      LEFT JOIN answers_master a ON q.question_id = a.question_id 
      LEFT JOIN answers_master ca ON q.answer_id = ca.answer_id  -- Join to get the correct answer text
      WHERE q.delete_flag = 0 
      ORDER BY q.question_id DESC;
    `;

    connection.query(sqlQuery, async (err, results) => {
      if (err) {
        return response.status(500).json({ success: false, msg: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return response.status(200).json({ success: false, msg: 'No data found', questions: [] });
      }

      const formattedData = [];
      let questionNumber = 1; // Start `s_no` from 1

      results.forEach(row => {
        let question = formattedData.find(q => q.question_id === row.question_id);

        if (!question) {
          question = {
            s_no: questionNumber++,  // Assign and increment question serial number
            question_id: row.question_id,
            question: row.question,
            createtime: moment(row.createtime).format("DD-MM-YYYY HH:mm A"),
            correct_answer_id: row.correct_answer_id, // Include correct answer ID
            correct_answer: row.correct_answer, // Include correct answer text
            answers: []
          };
          formattedData.push(question);
        }

        if (row.answer_id) {
          question.answers.push({
            s_no: question.answers.length + 1, // Answer sequence within each question
            answer_id: row.answer_id,
            answer: row.answer
          });
        }
      });

      return response.status(200).json({ success: true, msg: 'Data found', questions: formattedData });
    });
  } catch (error) {
    return response.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
};





const deleteQuiz = async (request, response) => {

  const { question_id } = request.body;

  try {

    if (!question_id) {
      return response.status(200).json({success: false,msg: languageMessages.msg_empty_param,key: "question_id"});
    }

    var sqlSelect = "SELECT question_id, question, createtime FROM question_master WHERE delete_flag = 0 AND question_id = ?";
    connection.query(sqlSelect, [question_id], async (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (result.length === 0) {
        return response.status(200).json({success: false,msg: languageMessages.msgDataFound});
      }

      if (result.length > 0) {
        var updateSql = "UPDATE question_master set delete_flag = 1 , updatetime = now() where delete_flag = 0 AND question_id = ?";
        connection.query(updateSql, [question_id], (err, updateQuestion) => {
          if (err) {
            return response.status(200).json({success: false,msg: languageMessages.internalServerError});
          }
          if (updateQuestion.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Error deleteing faq" });
          }
          if (updateQuestion.affectedRows > 0) {
            return response.status(200).json({success: true,msg: languageMessages.deleteFaqSuccess});
          }
        });
      }
    });
  } catch (error) {
    return response.status(200).json({success: false,msg: languageMessages.internalServerError,error: error.message});
  }
};

//OLD CODE MY

// const addQuiz = async (request, response) => {
//   const { question, answer1, answer2, answer3, answer4 } = request.body;

//   try {
//     // Validate inputs
//     if (!question) {
//       return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question" });
//     }

//     const answers = [answer1, answer2, answer3, answer4];
//     for (let i = 0; i < answers.length; i++) {
//       if (!answers[i]) {
//         return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: `answer${i + 1}` });
//       }
//     }

//     const checkDuplicateQuery = `
//       SELECT question_id FROM question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?);
//     `;

//     connection.query(checkDuplicateQuery, [question], (duplicateErr, duplicateRes) => {
//       if (duplicateErr) {
//         return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "2" });
//       }

//       if (duplicateRes.length > 0) {
//         return response.status(200).json({ success: false, msg: languageMessages.msgDataFound, key: "FaqAlreadyExist" });
//       }

//       // Insert question into question_master table
//       const insertQuestionQuery = `INSERT INTO question_master (question, createtime, updatetime) VALUES (?, NOW(), NOW())`;

//       connection.query(insertQuestionQuery, [question], (questionError, questionResult) => {
//         if (questionError) {
//           return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: questionError.message });
//         }

//         const questionId = questionResult.insertId; // Get inserted question_id

//         // Insert answers into answers_master table
//         const insertAnswersQuery = `INSERT INTO answers_master (question_id, answer, createtime, updatetime) VALUES ?`;
//         const answerValues = answers.map(answer => [questionId, answer, new Date(), new Date()]);

//         connection.query(insertAnswersQuery, [answerValues], (answerError, answerResult) => {
//           if (answerError) {
//             return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: answerError.message });
//           }

//           return response.status(200).json({ success: true, msg: languageMessages.FaqAddSucessfully });
//         });
//       });
//     });
//   } catch (error) {
//     return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
//   }
// };


const addQuiz = async (request, response) => {
  const { question, answer1, answer2, answer3, answer4, correctAnswerIndex } = request.body;

  try {
    // Validate inputs
    if (!question) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question" });
    }

    const answers = [answer1, answer2, answer3, answer4];
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i]) {
        return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: `answer${i + 1}` });
      }
    }

    if (correctAnswerIndex < 1 || correctAnswerIndex > 4 || isNaN(correctAnswerIndex)) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_invalid_param, key: "correctAnswerIndex" });
    }

    const checkDuplicateQuery = `
      SELECT question_id FROM question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?);
    `;

    connection.query(checkDuplicateQuery, [question], (duplicateErr, duplicateRes) => {
      if (duplicateErr) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "2" });
      }

      if (duplicateRes.length > 0) {
        return response.status(200).json({ success: false, msg: languageMessages.msgDataFound, key: "FaqAlreadyExist" });
      }

      const insertQuestionQuery = `INSERT INTO question_master (question, createtime, updatetime) VALUES (?, NOW(), NOW())`;

      connection.query(insertQuestionQuery, [question], (questionError, questionResult) => {
        if (questionError) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: questionError.message });
        }

        const questionId = questionResult.insertId; 

        const insertAnswersQuery = `INSERT INTO answers_master (question_id, answer, createtime, updatetime) VALUES ?`;
        const answerValues = answers.map(answer => [questionId, answer, new Date(), new Date()]);

        connection.query(insertAnswersQuery, [answerValues], (answerError, answerResult) => {
          if (answerError) {
            return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: answerError.message });
          }

          const getAnswerIdQuery = `
            SELECT answer_id FROM answers_master WHERE question_id = ? LIMIT 4;
          `;

          connection.query(getAnswerIdQuery, [questionId], (answerIdError, answerIdResults) => {
            if (answerIdError || answerIdResults.length < 4) {
              return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: answerIdError?.message || "Answers not found" });
            }

            const correctAnswerId = answerIdResults[correctAnswerIndex - 1].answer_id; 

            const updateQuestionQuery = `UPDATE question_master SET answer_id = ? WHERE question_id = ?`;

            connection.query(updateQuestionQuery, [correctAnswerId, questionId], (updateError) => {
              if (updateError) {
                return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: updateError.message });
              }

              return response.status(200).json({ success: true, msg: languageMessages.FaqAddSucessfully });
            });
          });
        });
      });
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
};

// const addQuiz = async (request, response) => {
//   const { question, answer1, answer2, answer3, answer4, correctAnswerIndex } = request.body;

//   try {
//     // Validate inputs
//     if (!question) {
//       return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question" });
//     }

//     const answers = [answer1, answer2, answer3, answer4];
//     for (let i = 0; i < answers.length; i++) {
//       if (!answers[i]) {
//         return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: `answer${i + 1}` });
//       }
//     }

//     const correctAnswerIndexInt = parseInt(correctAnswerIndex, 10);
//     if (isNaN(correctAnswerIndexInt) || correctAnswerIndexInt < 1 || correctAnswerIndexInt > 4) {
//       return response.status(200).json({ success: false, msg: languageMessages.msg_invalid_param, key: "correctAnswerIndex" });
//     }

//     const checkDuplicateQuery = `
//       SELECT question_id FROM question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?);
//     `;

//     connection.query(checkDuplicateQuery, [question], (duplicateErr, duplicateRes) => {
//       if (duplicateErr) {
//         return response.status(500).json({ success: false, msg: languageMessages.internalServerError, key: "2" });
//       }

//       if (duplicateRes.length > 0) {
//         return response.status(200).json({ success: false, msg: languageMessages.msgDataFound, key: "FaqAlreadyExist" });
//       }

//       // Insert question into question_master table
//       const insertQuestionQuery = `INSERT INTO question_master (question, createtime, updatetime) VALUES (?, NOW(), NOW())`;

//       connection.query(insertQuestionQuery, [question], (questionError, questionResult) => {
//         if (questionError) {
//           return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: questionError.message });
//         }

//         const questionId = questionResult.insertId; // Get inserted question_id

//         // Insert answers into answers_master table
//         const insertAnswersQuery = `INSERT INTO answers_master (question_id, answer, createtime, updatetime) VALUES ?`;
//         const answerValues = answers.map(answer => [questionId, answer, new Date(), new Date()]);

//         connection.query(insertAnswersQuery, [answerValues], (answerError, answerResult) => {
//           if (answerError) {
//             return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: answerError.message });
//           }

//           // Get the correct answer_id (ensure order is maintained)
//           const getAnswerIdQuery = `
//             SELECT answer_id FROM answers_master WHERE question_id = ? ORDER BY answer_id ASC;
//           `;

//           connection.query(getAnswerIdQuery, [questionId], (answerIdError, answerIdResults) => {
//             if (answerIdError || answerIdResults.length < 4) {
//               return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: answerIdError?.message || "Answers not found" });
//             }

//             // Get correct answer_id based on index (1-based index)
//             const correctAnswerId = answerIdResults[correctAnswerIndexInt - 1].answer_id;

//             // Update question_master table with correct_answer_id
//             const updateQuestionQuery = `UPDATE question_master SET correct_answer_id = ? WHERE question_id = ?`;

//             connection.query(updateQuestionQuery, [correctAnswerId, questionId], (updateError) => {
//               if (updateError) {
//                 return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: updateError.message });
//               }

//               return response.status(200).json({ success: true, msg: languageMessages.FaqAddSucessfully });
//             });
//           });
//         });
//       });
//     });
//   } catch (error) {
//     return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
//   }
// };

//OLD EditQuiz
  
// const editQuiz = async (request, response) => {
//   const { question_id, question, answer1, answer2, answer3, answer4 } = request.body;

//   try {
//     if (!question_id) {
//       return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question_id" });
//     }

//     if (!question) {
//       return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question" });
//     }

//     const answers = [answer1, answer2, answer3, answer4];
//     for (let i = 0; i < answers.length; i++) {
//       if (!answers[i]) {
//         return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: `answer${i + 1}` });
//       }
//     }

//     // Check if the question_id exists
//     const checkQuestionQuery = `SELECT question_id FROM question_master WHERE delete_flag = 0 AND question_id = ?`;

//     connection.query(checkQuestionQuery, [question_id], (checkErr, checkRes) => {
//       if (checkErr) {
//         return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "1" });
//       }

//       if (checkRes.length === 0) {
//         return response.status(200).json({ success: false, msg: languageMessages.msgDataNotFound, key: "questionNotFound" });
//       }

//       // Check for duplicate question (excluding current question_id)
//       const checkDuplicateQuery = `
//         SELECT question_id FROM question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?) AND question_id != ?;
//       `;

//       connection.query(checkDuplicateQuery, [question, question_id], (duplicateErr, duplicateRes) => {
//         if (duplicateErr) {
//           return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "2" });
//         }

//         if (duplicateRes.length > 0) {
//           return response.status(200).json({ success: false, msg: languageMessages.msgDataFound, key: "questionAlreadyExist" });
//         }

//         // Update question in question_master
//         const updateQuestionQuery = `UPDATE question_master SET question = ?, updatetime = NOW() WHERE question_id = ?`;

//         connection.query(updateQuestionQuery, [question, question_id], (updateQuestionErr, updateQuestionRes) => {
//           if (updateQuestionErr) {
//             return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "3" });
//           }

//           if (updateQuestionRes.affectedRows === 0) {
//             return response.status(200).json({ success: false, msg: languageMessages.errorUpdating });
//           }

//           // Delete existing answers for this question_id
//           const deleteAnswersQuery = `DELETE FROM answers_master WHERE question_id = ?`;

//           connection.query(deleteAnswersQuery, [question_id], (deleteErr) => {
//             if (deleteErr) {
//               return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "4" });
//             }

//             // Insert new answers
//             const insertAnswersQuery = `INSERT INTO answers_master (question_id, answer, createtime, updatetime) VALUES ?`;
//             const answerValues = answers.map(answer => [question_id, answer, new Date(), new Date()]);

//             connection.query(insertAnswersQuery, [answerValues], (insertErr) => {
//               if (insertErr) {
//                 return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "5" });
//               }

//               return response.status(200).json({ success: true, msg: languageMessages.DetailsUpdated });
//             });
//           });
//         });
//       });
//     });
//   } catch (error) {
//     return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
//   }
// };



const editQuiz = async (request, response) => {
  const { question_id, question, answer1, answer2, answer3, answer4, correctAnswerIndex } = request.body;

  try {
    if (!question_id) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question_id" });
    }

    if (!question) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: "question" });
    }

    const answers = [answer1, answer2, answer3, answer4];
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i]) {
        return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key: `answer${i + 1}` });
      }
    }

    if (correctAnswerIndex < 1 || correctAnswerIndex > 4 || isNaN(correctAnswerIndex)) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_invalid_param, key: "correctAnswerIndex" });
    }

    const checkQuestionQuery = `SELECT question_id FROM question_master WHERE delete_flag = 0 AND question_id = ?`;

    connection.query(checkQuestionQuery, [question_id], (checkErr, checkRes) => {
      if (checkErr) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "1" });
      }

      if (checkRes.length === 0) {
        return response.status(200).json({ success: false, msg: languageMessages.msgDataNotFound, key: "questionNotFound" });
      }

      const checkDuplicateQuery = `
        SELECT question_id FROM question_master WHERE delete_flag = 0 AND LOWER(question) = LOWER(?) AND question_id != ?;
      `;

      connection.query(checkDuplicateQuery, [question, question_id], (duplicateErr, duplicateRes) => {
        if (duplicateErr) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "2" });
        }

        if (duplicateRes.length > 0) {
          return response.status(200).json({ success: false, msg: languageMessages.msgDataFound, key: "questionAlreadyExist" });
        }

        const updateQuestionQuery = `UPDATE question_master SET question = ?, updatetime = NOW() WHERE question_id = ?`;

        connection.query(updateQuestionQuery, [question, question_id], (updateQuestionErr, updateQuestionRes) => {
          if (updateQuestionErr) {
            return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "3" });
          }

          if (updateQuestionRes.affectedRows === 0) {
            return response.status(200).json({ success: false, msg: languageMessages.errorUpdating });
          }

          const deleteAnswersQuery = `DELETE FROM answers_master WHERE question_id = ?`;

          connection.query(deleteAnswersQuery, [question_id], (deleteErr) => {
            if (deleteErr) {
              return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "4" });
            }

           
            const insertAnswersQuery = `INSERT INTO answers_master (question_id, answer, createtime, updatetime) VALUES ?`;
            const answerValues = answers.map(answer => [question_id, answer, new Date(), new Date()]);

            connection.query(insertAnswersQuery, [answerValues], (insertErr) => {
              if (insertErr) {
                return response.status(200).json({ success: false, msg: languageMessages.internalServerError, key: "5" });
              }

              // Fetch newly inserted answer IDs
              const getAnswerIdQuery = `SELECT answer_id FROM answers_master WHERE question_id = ? LIMIT 4`;

              connection.query(getAnswerIdQuery, [question_id], (answerIdError, answerIdResults) => {
                if (answerIdError || answerIdResults.length < 4) {
                  return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: answerIdError?.message || "Answers not found" });
                }

                const correctAnswerId = answerIdResults[correctAnswerIndex - 1].answer_id;

                
                const updateCorrectAnswerQuery = `UPDATE question_master SET answer_id = ? WHERE question_id = ?`;

                connection.query(updateCorrectAnswerQuery, [correctAnswerId, question_id], (updateError) => {
                  if (updateError) {
                    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: updateError.message });
                  }

                  return response.status(200).json({ success: true, msg: languageMessages.DetailsUpdated });
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
};


const getTabularGuard = async (request,response) => {
  const {from_date,to_date} = request.query;
  try {
    if(!from_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }
    var sqlSelect = `SELECT user_id, login_type, user_type, f_name, l_name, username, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime 
    FROM user_master  WHERE delete_flag = 0 AND user_type = 2 AND profile_completed = 1  AND Date(createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;

    connection.query(sqlSelect, [from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            active_flag_lable: (data.active_flag === 1) ? "active" : "deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
      // }
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}







//=====================getUserAnalyticalReports ==================================//

const getGuardAnalyticalReports = async (req, res) => {

  const data = req.query;

  if (!data) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  } else if (!data.action) {

    return res.status(200).json({
      status: true,
      msg: languageMessages.msg_empty_param,
      key: "from_date",
    });

  }

  else if (data.action !== 'get_users_analytical_report') {

   return res.status(200).json({
     status: true,
     msg: languageMessages.msg_empty_param,
     key: "from_date",
   });

  } else {




      try {
          const month_report_arr = [];
          const year_report_arr = [];
          const month_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const current_year = new Date().getFullYear();

          for (let i = 0; i < month_arr.length; i++) {
              const month_text = month_arr[i];
              const current_month = i + 1;
              const month_user_arr = await getGuardAnalyticalReportsData(
                "monthly",
                current_year,
                current_month,
                "All"
              );
              month_report_arr.push({ month: month_text, month_user_arr: month_user_arr });
          }

          for (let i = 2020; i <= current_year; i++) {
              const year_user_arr = await getGuardAnalyticalReportsData(
                "yearly",
                i,
                "",
                "All"
              );
              year_report_arr.push({ year: i, year_user_arr: year_user_arr });
          }

          const record = {
            success: true,
            msg: languageMessages.msgDataFound,
            data: { month_report_arr, year_report_arr },
          };
          return res.json(record);

      } catch (error) {
          console.log("database error key 2:", error);
          const record = { success: false, msg: languageMessages.internalServerError, key: error };
          return res.json(record);
      }

  }

};
function getGuardAnalyticalReportsData(
type,
current_year,
current_month,
get_by_type
) {
// console.log("current_month:", current_month);

return new Promise((resolve, reject) => {
  let whereClause = "";

  if (type === "monthly" && get_by_type === "All") {
    whereClause = `AND YEAR(createtime) = ${current_year} AND MONTH(createtime) = ${current_month}`;
  } else if (type === "yearly" && get_by_type === "All") {
    whereClause = `AND YEAR(createtime) = ${current_year}`;
  }

  const query = `SELECT user_id FROM user_master WHERE  delete_flag = 0 AND user_type = 2 ${whereClause} AND profile_completed = 1 ORDER BY user_id DESC`;

  connection.query(query, (error, rows) => {
    if (error) {
      console.error("Database query error:", error);
      reject(error); // Reject the promise with the error
      return;
    }

    const userCount = rows.length > 0 ? rows.length : 0;
    resolve(userCount); // Resolve the promise with the count of rows
  });
});
}



const fetchGuard = async (request, response) => {
  var fetch =
    "SELECT user_id, f_name,l_name, name FROM user_master WHERE delete_flag = 0 AND user_type != 0 AND user_type != 1";

  connection.query(fetch, async (err, res) => {
    if (err) {
      return response
        .status(200)
        .json({ success: false, msg: languageMessages.internalServerError });
    }

    if (res.length <= 0) {
      return response
        .status(200)
        .json({ success: false, msg: "data not foung" });
    }

    if (res.length > 0) {
      return response
        .status(200)
        .json({ success: true, msg: "data foung", res });
    } else {
      return response
        .status(200)
        .json({ success: false, msg: "user not foung" });
    }
  });
};
//===================== end getUserAnalyticalReports=============================//

const getallCategoryFetch = async(request, response) => {
  try{
    var sqlSelect = "SELECT category_id, category_name, createtime FROM category_master WHERE delete_flag = 0 order by category_id desc";
    connection.query(sqlSelect, async(err, result) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
        });
      }
      var society_arr = [];
      if(result.length === 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          society_arr: society_arr
        });
      }
      var s_no = 0;
      for(var data of result){
        s_no++;
        society_arr.push({
          s_no: s_no,
          society_id: data.category_id,
          society_name: data.category_name,
          createtime: moment(data.createtime).format("DD-MM-HH:mm A"),
        });
      }

      return response.status(200).json({
        success: true,
        msg: languageMessages.msgDataFound,
        society_arr: society_arr,
      });
    });

  }catch(error){
    return response.status(200).json({
      success: true,
      msg: languageMessages.internalServerError,
      key: "catch",
    })
  }
}



const FetchParkingHistory = async (request, response) => {
  const data = request.body;
  const { user_id } = data;

  if (!user_id) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
    });
  }

  const checkUser = "SELECT user_id FROM user_master WHERE user_id = ?";
  connection.query(checkUser, [user_id], (err, res) => {
    if (err) {
      return response.status(500).json({ success: false, msg: languageMessages.internalServerError });
    }

    if (res.length === 0) {
      return response.status(200).json({ success: false, msg: languageMessages.msgUserNotFound });
    }

    // Query to fetch parking history
    const FetchDetails = `
      SELECT 
        pm.vehical_id, 
        pm.parking_number, 
        pm.duration, 
        pm.createtime,
        vm.model_name, 
        vm.plate_number
      FROM parking_master pm
      JOIN vehical_master vm ON pm.vehical_id = vm.vehical_id
      WHERE pm.user_id = ? AND pm.delete_flag = 0;
    `;

    connection.query(FetchDetails, [user_id], (err, userResult) => {
      if (err) {
        return response.status(500).json({ success: false, msg: languageMessages.internalServerError });
      }

      if (userResult.length === 0) {
        return response.status(200).json({ success: false, msg: "No parking history found." });
      }

      let user_arr = userResult.map((data, index) => ({
        s_no: index + 1, // Adding Serial Number (S.No)
        vehical_id: data.vehical_id,
        parking_number: data.parking_number,
        duration: data.duration,
        model_name: data.model_name,
        plate_number: data.plate_number,
        createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
      }));

      return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, res: user_arr });
    });
  });
};


const addSocietyPanelByAdmin = async (request, response) => {
  const { society_name, location, email, password } = request.body;

  // Validate required fields
  if (!society_name) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "1", // Society name is missing
    });
  }

  if (!location) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "2", // Location is missing
    });
  }

  if (!email) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "3", // Email is missing
    });
  }

  if (!password) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "4", // Password is missing
    });
  }

  try {
    const hashedPassword = await hashPassword(password);

    const checkMailQuery = "SELECT user_id, email FROM user_master WHERE email = ? AND user_type = 3 AND delete_flag = 0";
    
    connection.query(checkMailQuery, [email], async (err, results) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          key: "5",
          error: err.message,
        });
      }

      if (results.length > 0) {
        return response.status(200).json({
          success: false,
          msg: "Email already exists", // Ensure msg is a string
          key: "6", // Email already exists
        });
      }

      // Insert the new society panel into the database
      const insertQuery = `
        INSERT INTO user_master (society_name, location, email, password, user_type, delete_flag, createtime)
        VALUES (?, ?, ?, ?, 3, 0, now())
      `;
      connection.query(
        insertQuery,
        [society_name, location, email, hashedPassword],
        async (insertErr, insertResult) => {
          if (insertErr) {
            return response.status(200).json({
              success: false,
              msg: languageMessages.internalServerError,
              key: "7", // Database insert error
              error: insertErr.message,
            });
          }

          if (insertResult.affectedRows <= 0) {
            return response.status(200).json({
              success: false,
              msg: languageMessages.msgDataNotFound,
              key: "8"
            });
          }

          // Generate email bodySocietyAdminAdd
          const subject = "Society Panel Access Credentials";
          const app_name = "Parkom";
          const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
          const adminEmail = email;
          const adminPassword = password;
          const panelLink = "https://meribhiapp.com/2024/parkom/society_panel/";

          const mailBody = mailBodySocietyPasswordMail({
            adminPassword,
            adminEmail,
            subject,
            app_logo,
            app_name,
            panelLink, 
          });

          const mailRes = await SocietyPasswordMail(adminEmail, subject, mailBody);

          if (mailRes.success) {
            return response.status(200).json({
              success: true,
              msg: "Society Panel Access Credentials email sent successfully.",
            });
          } else {
            return response.status(200).json({
              success: false,
              msg: "Failed to send Society Panel Access Credentials email.",
              error: mailRes.error,
            });
          }
        }
      );
    });
  } catch (err) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: "9", // General error
      error: err.message,
    });
  }
};














// **********************************************************_____Society__Admin__Panel_____**********************************************************



const SocietyadminLogin = async (request, response) => {

  const { email, password } = request.body;

  try {
    if (!email) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "email",
      });
    }

    if (!password) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "password",
      });
    }

    const sqlCheckUser =
      "SELECT user_id,email, password, active_flag, user_type, society_name FROM user_master WHERE email = ? AND delete_flag = 0 AND user_type = 3";

    connection.query(sqlCheckUser, [email], async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.emailNotRegistered,
          key: "email",
        });
      }

      if (userResult.length > 0) {

        var adminPassword = userResult[0].password;

        const hashedPass = await hashPassword(password);

        if (adminPassword != hashedPass) {
          return response.status(200).json({
            success: false,
            msg: languageMessages.emailNotRegistered,
            key: "password",
          });
        } else {
          const payload = { subject: userResult[0].email };

          const key = rs.generate();

          const token = jwt.sign(payload, key);

          return response.status(200).json({
            success: true,
            msg: languageMessages.loginSuccessfully,
            key: "login_successfully",
            token: token,
            // society_name: userResult[0].society_name,
            info: userResult,
          });
        }
      }
    });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
};





const FetchAllGatepassUser = async (request, response) => {
    
    const { society_id } = request.query;
    
    if(!society_id){
         return response.status(200).json({
          success: false,
          msg: "society_id is Missing",
          
        });
    }
        
   
  try {
    const sqlCheckUser =
      "SELECT user_id, user_side, login_type, approve_flag, parkom_active_flag, gatepass_active_flag, user_type, f_name, l_name, username, name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND user_side = 2 AND user_type = 1 AND otp_verify = 1 AND society_id = ? ORDER BY user_id DESC;";


     
    connection.query(sqlCheckUser,[society_id],  async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            user_side: data.user_side,

            approve_flag: data.approve_flag,

            username: data.username,

            f_name: data.f_name,

            parkom_active_flag: data.parkom_active_flag,

            gatepass_active_flag: data.gatepass_active_flag,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            user_type : data.user_type,

            user_type_lable_filter : (data.user_type == 0) ? "Admin" : (data.user_type == 1) ? "Customer" : "Business",

            user_type_lable : "0=admin 1=user 2=customer",

            active_flag_lable: (data.active_flag === 1) ? "Active" : "Deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};



//reject vendor and delivery datas
const rejectUser = async (request, response) => {
  const { user_id } = request.body
  try {
    if (!user_id) {
      return response.status(200).json({
        success: false,
        message: languageMessages.msg_empty_param,
        key: 'user_id'
      })
    }
    //check user exist 
    const sql = "SELECT email, name, mobile, active_flag FROM user_master WHERE user_id = ? AND user_type = 1 AND user_side = 2 AND delete_flag=0"
    connection.query(sql, [user_id], (err, info) => {
      if (err) {
        return response.status(200).json({
          success: false,
          message: languageMessages.internalServerError,
          error: err.message
        })
      }
      if (info.length <= 0) {
        return response.status(200).json({
          success: false,
          message: languageMessages.msgUserNotFound
        })
      }

      //update status 
      const updatesql = "UPDATE user_master SET approve_flag = 2 WHERE user_id = ?"
      connection.query(updatesql, [user_id], (updateError, updateResult) => {
        if (updateError) {
          return response.status(200).json({
            success: false,
            message: languageMessages.internalServerError,
            error: updateError.message
          })
        }
        if (updateResult.affectedRows <= 0) {
          return response.status(200).json({
            success: false,
            message: languageMessages.userNotVerified
          })
        }

        return response.status(200).json({
          success: true,
          message: languageMessages.userVerifiedSuccessfully,
          updateResult: updateResult
        })
      })
    })

  } catch (err) {
    return response.status(200).json({
      success: false,
      message: languageMessages.internalServerError,
      error: err.message,
    });
  }
}

//approve vendor and delivery datas Not Usable
// const approveUser = async (request, response) => {
//   const { user_id } = request.body
//   try {
//     if (!user_id) {
//       return response.status(200).json({
//         success: false,
//         message: languageMessages.msg_empty_param,
//         key: 'user_id'
//       })
//     }
//     //check user exist 
//     const sql = "SELECT email, name, mobile, active_flag FROM user_master WHERE user_id = ? AND user_type = 1 AND user_side = 2 AND delete_flag=0"
//     connection.query(sql, [user_id], (err, info) => {
//       if (err) {
//         return response.status(200).json({
//           success: false,
//           message: languageMessages.internalServerError,
//           error: err.message
//         })
//       }
//       if (info.length <= 0) {
//         return response.status(200).json({
//           success: false,
//           message: languageMessages.msgUserNotFound
//         })
//       }

//       //update status 
//       const updatesql = "UPDATE user_master SET approve_flag = 1 WHERE user_id = ?"
//       connection.query(updatesql, [user_id], (updateError, updateResult) => {
//         if (updateError) {
//           return response.status(200).json({
//             success: false,
//             message: languageMessages.internalServerError,
//             error: updateError.message
//           })
//         }
//         if (updateResult.affectedRows <= 0) {
//           return response.status(200).json({
//             success: false,
//             message: languageMessages.userNotVerified
//           })
//         }

//         return response.status(200).json({
//           success: true,
//           message: languageMessages.userVerifiedSuccessfully,
//           updateResult: updateResult
//         })
//       })
//     })

//   } catch (err) {
//     return response.status(200).json({
//       success: false,
//       message: languageMessages.internalServerError,
//       error: err.message,
//     });
//   }
// }

const handleUserApproveRejectStatus = async (request, response) => {
  const { user_id, action } = request.body; // action can be 'approve', 'reject', or 'toggleActive'

  try {
    if (!user_id || !action) {
      return response.status(200).json({
        success: false,
        message: languageMessages.msg_empty_param,
        key: 'user_id or action',
      });
    }

    // Check if the user exists
    const sql = "SELECT email, name, mobile, active_flag, approve_flag FROM user_master WHERE user_id = ? AND user_type = 1 AND user_side = 2 AND delete_flag = 0";
    connection.query(sql, [user_id], (err, info) => {
      if (err) {
        return response.status(200).json({
          success: false,
          message: languageMessages.internalServerError,
          error: err.message,
        });
      }

      if (info.length <= 0) {
        return response.status(200).json({
          success: false,
          message: languageMessages.msgUserNotFound,
        });
      }

      const user = info[0];

      if (action === 'approve' || action === 'reject') {
        if (user.approve_flag !== 0) {
          return response.status(200).json({
            success: false,
            message: languageMessages.userAlreadyVerified,
          });
        }

        const newApproveFlag = action === 'approve' ? 1 : 2; // 1 = Approved, 2 = Rejected
        const updateSql = "UPDATE user_master SET approve_flag = ? WHERE user_id = ?";
        connection.query(updateSql, [newApproveFlag, user_id], (updateError, updateResult) => {
          if (updateError) {
            return response.status(200).json({
              success: false,
              message: languageMessages.internalServerError,
              error: updateError.message,
            });
          }

          if (updateResult.affectedRows <= 0) {
            return response.status(200).json({
              success: false,
              message: languageMessages.userNotVerified,
            });
          }

          return response.status(200).json({
            success: true,
            message: action === 'approve' ? languageMessages.userApprovedSuccessfully : languageMessages.userRejectedSuccessfully,
            updateResult: updateResult,
          });
        });
      } else if (action === 'toggleActive') {
        // Only allow toggling active status if the user is approved
        if (user.approve_flag !== 1) {
          return response.status(200).json({
            success: false,
            message: languageMessages.userNotApproved,
          });
        }

        const newActiveFlag = user.active_flag === 1 ? 0 : 1; // Toggle active status
        const updateSql = "UPDATE user_master SET active_flag = ? WHERE user_id = ?";
        connection.query(updateSql, [newActiveFlag, user_id], (updateError, updateResult) => {
          if (updateError) {
            return response.status(200).json({
              success: false,
              message: languageMessages.internalServerError,
              error: updateError.message,
            });
          }

          if (updateResult.affectedRows <= 0) {
            return response.status(200).json({
              success: false,
              message: languageMessages.userStatusNotUpdated,
            });
          }

          return response.status(200).json({
            success: true,
            message: newActiveFlag === 1 ? languageMessages.userActivatedSuccessfully : languageMessages.userDeactivatedSuccessfully,
            updateResult: updateResult,
          });
        });
      } else {
        return response.status(200).json({
          success: false,
          message: languageMessages.invalidAction,
        });
      }
    });
  } catch (err) {
    return response.status(200).json({
      success: false,
      message: languageMessages.internalServerError,
      error: err.message,
    });
  }
};


const addBuildingBySocietyPanel = async (req, res) => {
  
 
  const { building_name, society_id } = req.body;
   
  // return res.status(200).json({
  //   success: true,
  //   msg:society_id,
  //   key: req.body,
  // });


  try {

    if (!society_id) {
      return res.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "Society Id is Missing",
      });
    }

    if (!building_name) {
      return res.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "building_name is Missing",
      });
    }

    const checkDuplicateName =
      "SELECT building_id FROM building_master WHERE delete_flag = 0 AND LOWER(building_name) = LOWER(?)";

    connection.query(checkDuplicateName, [building_name], (duplicateErr, duplicateRes) => {
      if (duplicateErr) {
        console.error("Database Error:", duplicateErr);
        return res.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          key: "DB_ERROR_DUPLICATE_CHECK",
        });
      }

      if (duplicateRes.length > 0) {
        return res.status(200).json({
          success: false,
          msg: "Building already exists",
          key: "BuildingAlreadyExist",
        });
      }

      const insertBuilding =
        "INSERT INTO building_master (building_name, society_id, createtime, updatetime) VALUES (?,?, NOW(), NOW())";

      connection.query(insertBuilding, [building_name,society_id], (insertErr, result) => {
        if (insertErr) {
          console.error("Insert Error:", insertErr);
          return res.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            error: insertErr.message,
          });
        }

        if (result.affectedRows <= 0) {
          return res.status(200).json({
            success: false,
            msg: "Failed to add building",
          });
        }

        return res.status(200).json({
          success: true,
          msg: "Building added successfully",
          building_id: result.insertId, // Returning the new building ID
        });
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    });
  }
};



const getAllSocietyPanelbuilding = async (req, res) => {
  
  const { society_id } = req.body;
  
  
  try {

    if(!society_id){
      return res.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "1",
      });
      
    }
    const sqlSelect = `
         
          SELECT 
              building_id,
              building_name,
              createtime
              FROM building_master 
              WHERE society_id = ? AND  delete_flag = 0
              ORDER BY building_id DESC 
    `
    
    connection.query(sqlSelect, [society_id], (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
        });
      }

      if (!result || result.length === 0) {
        return res.status(200).json({
          success: false,
          msg: "No buildings found",
          building_arr: [],
        });
      }

      const buildingArr = result.map((data, index) => ({
        s_no: index + 1,
        building_id: data.building_id,
        building_name: data.building_name,
        // society_name: data.society_name,
        createtime: data.createtime
          ? moment(data.createtime).format("DD-MM-YYYY HH:mm A")
          : null,
      }));

      return res.status(200).json({
        success: true,
        msg: "Buildings fetched successfully",
        building_arr: buildingArr,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
    });
  }
};


const getSocietyPanelBuildingNameDropdown = async(request, response) => {

  const { society_id } = request.body;


  try{

    if (!society_id || society_id === "") {
      return response.status(200).json({
          success: false,
          msg: languageMessages.msg_empty_param,
          key: "1"
      });
  }

    const sqlSelect = "SELECT building_id, building_name FROM building_master WHERE society_id = ? AND delete_flag = 0";


    connection.query(sqlSelect, [society_id], async (error, result) => {
      if(error){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          error: error.message,
        })
      }

     
      if(!result.length || result.length < 0){
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataNotFound,
          key: "7"

        })
      }



      if(result.length > 0){
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          result: result,
        })
      }
    });

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      error: error.message,
    })
  }
}


const addNewGuardFromSocietyPanel = async (request, response) => {
  const { name, mobile, email, society_id, building_id, password, society_name, shift } = request.body;
  let image = request.file ? request.file.filename : null;

  // Validate required fields
  if (!society_name) {
    return response.status(200).json({ success: false, msg: "Society name is required", key: "society_name" });
  }
  if (!name) {
    return response.status(200).json({ success: false, msg: "Name is required", key: "name" });
  }
  if (!mobile) {
    return response.status(200).json({ success: false, msg: "Mobile number is required", key: "mobile" });
  }
  if (!society_id) {
    return response.status(200).json({ success: false, msg: "Society ID is required", key: "society_id" });
  }
  if (!email) {
    return response.status(200).json({ success: false, msg: "Email is required", key: "email" });
  }
  if (!building_id) {
    return response.status(200).json({ success: false, msg: "Building ID is required", key: "building_id" });
  }
  if (!password) {
    return response.status(200).json({ success: false, msg: "Password is required", key: "password" });
  }

  try {
    // Check for duplicate email
    const checkDuplicateQuery = "SELECT user_id, email FROM user_master WHERE delete_flag = 0 AND user_type = 2 AND email = ?";
    connection.query(checkDuplicateQuery, [email], async (duplicateErr, duplicateRes) => {
      if (duplicateErr) {
        console.error("Database query error:", duplicateErr);
        return response.status(200).json({ success: false, msg: "Internal Server Error", key: "database_error" });
      }

      if (duplicateRes.length > 0) {
        return response.status(200).json({ success: false, msg: "Guard with this email already exists", key: "duplicate_email" });
      }

      // Hash the password
      const hashedPass = await hashPassword(password);

      // Insert the new guard into the database
      const insertQuery = `
        INSERT INTO user_master (user_type, name, mobile, email, society_id, building_id, society_name, password, added_by, image,shift, createtime, updatetime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, NOW(), NOW())
      `;
      const userType = 2; // Guard user type
      connection.query(
        insertQuery,
        [userType, name, mobile, email, society_id, building_id, society_name, hashedPass, society_id, image,shift],
        async (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Database insert error:", insertErr);
            return response.status(200).json({ success: false, msg: "Internal Server Error", key: "database_error" });
          }

          if (insertResult.affectedRows <= 0) {
            return response.status(200).json({ success: false, msg: "Failed to add guard", key: "insert_failed" });
          }

          // Send email with credentials
          const subject = "Guard Access Credentials";
          const app_name = "Parkom";
          const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";
          const mailBody = mailBodyGuardPasswordMail({
            GuardPassword: password,
            GuardEmail: email,
            subject,
            app_logo,
            app_name,
          });

          try {
            const mailRes = await GuardPasswordMail(email, subject, mailBody);
            if (mailRes.success) {
              return response.status(200).json({ success: true, msg: "Guard added and email sent successfully" });
            } else {
              return response.status(200).json({ success: false, msg: "Failed to send email", error: mailRes.error });
            }
          } catch (mailErr) {
            console.error("Email sending error:", mailErr);
            return response.status(200).json({ success: false, msg: "Failed to send email", error: mailErr.message });
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in addNewGuardFromSocietyPanel:", error);
    return response.status(200).json({ success: false, msg: "Internal Server Error", key: "unexpected_error", error: error.message });
  }
};

const getAllGuardDataFromSocietyPanel = async (request, response) => {

  const { added_by } = request.query;

  if(!added_by){
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "ID Missing",
    });

  }
  try {
    const sqlCheckUser = `
  SELECT 
    u.user_id, 
    u.f_name, 
    u.l_name, 
    u.name, 
    u.mobile, 
    u.email, 
    u.password, 
    u.active_flag,  
    u.createtime, 
    u.updatetime, 
    u.society_name, 
    b.building_name
  FROM user_master u
  LEFT JOIN building_master b ON u.building_id = b.building_id
  WHERE u.delete_flag = 0 
    AND u.user_type = 2
    AND u.added_by = ?
  ORDER BY u.user_id DESC;
`;

    connection.query(sqlCheckUser, [added_by], async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      var user_arr = [];

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: [],
        });
      }

      var s_no = 0;

      if (userResult.length > 0) {
        for (var data of userResult) {
          s_no++;

          user_arr.push({
            
            s_no: s_no,

            password: data.password,

            user_id: data.user_id,

            f_name: data.f_name,

            l_name: data.l_name,

            name : data.name,

            email: data.email,

            mobile: data.mobile,

            society_name: data.society_name,

            building_name: data.building_name,

           role: data.role,
           
            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : [],
        });
      }
    });
  } catch (error) {
    return response
      .status(200)
      .json({ success: false, msg: languageMessages.msgDataFound });
  }
};

const getSocietyAdminAllData = async (request,response) => {

  const { email }  = request.query;

  if(!email){
    return response.status(200).json({success: false,msg: languageMessages.msg_empty_param, key: "Email",})
  }
  try {
    const sqlCheckUser =
    `SELECT user_id, email, username,society_name, password, active_flag, user_type, image 
    FROM user_master 
    WHERE email = ? AND delete_flag = 0 AND user_type = 3`;

  connection.query(sqlCheckUser, [email],  async (err, userResult) => {
    if (err) {
      return response.status(200).json({success: false,msg: languageMessages.internalServerError,err: err.message,
      });
    }

    if (userResult.length <= 0) {
      return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "email",
      });
    }

    if (userResult.length > 0) {
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,key: "data found",info: userResult,});
     }
  });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}


const UpdateSocietyPanelAdminProfile = async (request, response) => {
  const { user_id, society_name, email } = request.body;
  try {
    let image = request.file ? request.file.filename : null;

    if (!user_id || !society_name || !email) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param });
    }

    let updateQuery = "UPDATE user_master SET society_name = ?, email = ?";
    let params = [ society_name, email];

    if (image) {
      updateQuery += ", image = ?";
      params.push(image);
    }

    updateQuery += " WHERE user_id = ? AND user_type = 3 AND delete_flag = 0";

    params.push(user_id);

    connection.query(updateQuery, params, (err, result) => {
      if (err) {
        return response.status(200).json({ success: false, msg: languageMessages.internalServerError, err: err.message });
      }
      if (result.affectedRows > 0) {
        return response.status(200).json({ success: true, msg: "Admin profile updated successfully.", key: "Edit" });
      } else {
        return response.status(200).json({ success: false, msg: "Failed to update profile." });
      }
    });
  } catch (error) {
    return response.status(200).json({ success: false, msg: lang.internalServerError, error: error.message });
  }
};


const UpdateSocietyPanelPassword = async (request, response) => {

  const { user_id, oldpassword, newPassword } = request.body;

  

  try {

    if (!user_id) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "User_id",
      });
    }

    if (!oldpassword) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "old_password",
      });
    }

    if (!newPassword) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "new_password",
      });
    }

    // var sql =
    //   "SELECT user_id FROM user_master WHERE user_id = ? AND user_type = 3 and delete_flag = 0";

    // connection.query(sql, [user_id], async (err, info) => {
    //   if (err) {
    //     return response
    //       .status(200)
    //       .json({ success: false, msg: languageMessages.internalServerError });
    //   }

    //   if (info.length <= 0) {
    //     return response
    //       .status(200)
    //       .json({ success: false, msg: languageMessages.msgUserNotFound });
    //   }

    //   if (info[0].active_flag === 0) {
    //     return response.status(200).json({
    //       success: false,
    //       msg: languageMessages.accountdeactivated,
    //       active_status: 0,
    //     });
    //   }

    //   console.log(info[0].user_id);

      var sqlforget = "select password from user_master where user_id = ? AND user_type = 3 AND delete_flag = 0";

      connection.query(sqlforget, [user_id], async (err, data) => {
        if (err) {
          return response
            .status(200)
            .json({ success: false, msg: languageMessages.internalServerError });
        } else {
          if (data.length <= 0) {
            return response
              .status(200)
              .json({ success: false, msg: languageMessages.msgDataNotFound });
          }

          var password = data[0].password;

          // console.log(password);

          const old_password_hash = await hashPassword(oldpassword);

          // console.log('this is mine ', old_password_hash);

          // console.log('db pass', password);

          if (password === old_password_hash) {
            const new_pass = await hashPassword(newPassword);

            if(new_pass != old_password_hash) {
              var updateSql = "UPDATE user_master SET password=?, updatetime = NOW() WHERE user_id = ? AND delete_flag = 0";

            connection.query(updateSql, [new_pass, user_id], (err) => {
              if (err) {
                return response.status(200).json({success: false,msg: languageMessages.internalServerError});
              } else {
                return response.status(200).json({success: true,msg: languageMessages.PasswordUpdatedSuccessfully,key: "success" });
              }
            });
            } else {
              return response.status(200).json({
                success: true,
                msg: languageMessages.newOldPassword,
                key: "samePassword",
              });
            }
          } else {
            return response.status(200).json({
              success: false,
              msg: languageMessages.newOldPassword,
              key: "failure",
            });
          }
        }
      });
    // });
  } catch (error) {
    console.error("Error:", error);

    return response
      .status(200)
      .json({ success: false, msg: languageMessages.internalServerError });
  }
};


const getSocietyPanelAllData = async (request,response) => {

  const {user_id} = request.query;

  if(!user_id){
    return response.status(200).json({success: false,msg: languageMessages.msg_empty_param, key: "User_id",
    });
  } 
  try {
    const sqlCheckUser =
    "SELECT user_id,email,username, password, user_id, active_flag, user_type, society_name ,image FROM user_master WHERE user_id = ? AND delete_flag = 0 AND user_type = 3";

  connection.query(sqlCheckUser, [user_id],  async (err, userResult) => {
    if (err) {
      return response.status(200).json({success: false,msg: languageMessages.internalServerError,err: err.message,
      });
    }

    if (userResult.length <= 0) {
      return response.status(200).json({success: false,msg: languageMessages.msgDataNotFound,key: "email",
      });
    }

    if (userResult.length > 0) {
      return response.status(200).json({success: true,msg: languageMessages.msgDataFound,key: "data found",info: userResult,});
     }
  });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}

const activateDactivateSocietyPanel = (req, res) => {
  try {
      const { user_id, active_flag } = req.body;

      // console.log('user_id', user_id);
      // console.log('active_flag', active_flag);

      // Update the active_flag in the database
      const query = 'UPDATE user_master SET gatepass_active_flag = ?, updatetime = NOW() WHERE user_id = ?';
      connection.query(query, [active_flag, user_id], (error, results) => {
          if (error) {
              if (gatepass_active_flag === 1) {
                  return res.status(500).json({ success: false, msg: 'Error activating user.' });
              } else {
                  return res.status(500).json({ success: false, msg: 'Error deactivating user.' });
              }
          }

          // Fetch user details from the database
          const userDetailQuery = 'SELECT name, email, gatepass_active_flag FROM user_master WHERE user_id = ?';
          connection.query(userDetailQuery, [user_id], (userError, userResults) => {
              if (userError || !userResults.length) {
                  console.error('Error fetching user details:', userError);
                  return res.status(500).json({ success: false, msg: 'Internal server error.' });
              }

              const { gatepass_active_flag } = userResults[0];

              if (gatepass_active_flag === 1) {
                  return res.status(200).json({ success: true, msg: 'User activated successfully.' });
              } else {
                  return res.status(200).json({ success: true, msg: 'User deactivated successfully.' });
              }
          });
      });
  } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ success: false, msg: 'Internal server error.', error: error.message });
  }
};

const getSocietyBuildingTotalCount = async(request, response) => {
  const { society_id } = request.query;
  if(!society_id){
    return response.status(200).json({
      success:false,
      msg: languageMessages.msg_empty_param,
      key: "1",
    })
  }
  try{
    const sqlcheckGuard = "SELECT count(building_id) as building_count FROM building_master WHERE delete_flag = 0 AND society_id = ?";
    connection.query(sqlcheckGuard,[society_id], async (err, guardResult) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,

        })
      }

      if (guardResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (guardResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          guardResult: guardResult,
        });
      }

    })

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: "Catch",
    });
  }
}


const getSocietyGuardTotalCount = async(request, response) => {
  const {added_by} = request.query;
  if(!added_by){
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "1",
    })
  }
  try{
    const sqlcheckGuard = "SELECT count(user_id) as guard_count FROM user_master WHERE delete_flag = 0 AND user_type = 2 AND added_by = ?";
    connection.query(sqlcheckGuard, [added_by], async (err, guardResult) => {
      if(err){
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,

        })
      }

      if (guardResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (guardResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          guardResult: guardResult,
        });
      }

    })

  }catch(error){
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      key: "Catch",
    });
  }
}


const ActivateDeactivateSocietyUser = async (request, response) => {
  const data = request.body;

  const { user_id } = data;

  if (!user_id) {
    return response

      .status(200)

      .json({ success: false, msg: "Missing user_id" });
  }


  try {
    const checkUserQuery =
      "SELECT * FROM user_master WHERE user_id = ? AND delete_flag = 0 AND user_side = 2";

    connection.query(checkUserQuery, [user_id], async (err, res) => {
      if (err) {
        console.error("Error querying database:", err);

        return response

          .status(200)

          .json({ success: false, msg: "Internal server error" });
      }

      if (res.length === 0) {
        return response

          .status(200)

          .json({ success: false, msg: "User not found" });
      }

      const user = res[0];

      const userName = user.f_name+ " " +user.l_name;

      const userEmail = user.email;

      const newActiveFlag = user.gatepass_active_flag === 1 ? 0 : 1;

      const newStatusMsg = user.gatepass_active_flag === 1 ? "Activated" :  "Deactivated" ;

      const updateUserQuery =
        "UPDATE user_master SET gatepass_active_flag = ? WHERE user_id = ?";

      connection.query(
        updateUserQuery,

        [newActiveFlag, user_id],

        async (err, result) => {
          if (err) {
            console.error("Error updating user:", err);

            return response

              .status(200)

              .json({ success: false, msg: "Internal server error" });
          }

          const { affectedRows } = result;

          if (affectedRows > 0) {
            const subject = "Account Info";

            const app_name = process.env.APP_NAME;

            const app_logo = "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";

            const mailBody = mailBodyActivateDeactivateUser({
              userName,

              newStatusMsg,

              app_name,

              app_logo,
            });

            try {
              const mailResponse = await ActivateDeactivateMailUser(
                userEmail,

                subject,

                mailBody
              );

              if (mailResponse.success) {
                return response

                  .status(200)

                  .json({ success: true, msg: languageMessages.EmailSent });
              } else {
                return response.status(200).json({
                  success: false,

                  msg: "Error sending email ",
                });
              }
            } catch (error) {
              console.error("Error sending email:", error);

              return response.status(200).json({
                success: false,

                msg: "Failed to send email ",
              });
            }
          } else {
            return response

              .status(200)

              .json({ success: false, msg: "Failed to update user status" });
          }
        }
      );
    });
  } catch (error) {
    console.error("Caught exception:", error);

    return response

      .status(200)

      .json({ success: false, msg: "Internal server error" });
  }
};



// Approve Gatepass User
const approveGatepassUser = async (request, response) => {
  const { user_id } = request.body;

  if (!user_id) {
      return response.status(200).json({
          success: false,
          message: "User ID is required",
      });
  }

  const sql = `
      UPDATE user_master 
      SET approve_flag = 1 
      WHERE user_id = ? 
      AND user_side = 2 
      AND delete_flag = 0
  `;

  connection.query(sql, [user_id], (err, result) => {
      if (err) {
          return response.status(500).json({
              success: false,
              message: "Internal Server Error",
              error: err.message,
          });
      }
      
      if (result.affectedRows > 0) {
          return response.status(200).json({
              success: true,
              message: "User approved successfully",
          });
      } else {
          return response.status(200).json({
              success: false,
              message: "User not found or already processed",
          });
      }
  });
};

// Reject Gatepass User
const rejectGatepassUser = async (request, response) => {
  const { user_id } = request.body;

  if (!user_id) {
      return response.status(200).json({
          success: false,
          message: "User ID is required",
      });
  }

  const sql = `
      UPDATE user_master 
      SET approve_flag = 2 
      WHERE user_id = ? 
      AND user_side = 2 
      AND delete_flag = 0
  `;

  connection.query(sql, [user_id], (err, result) => {
      if (err) {
          return response.status(500).json({
              success: false,
              message: "Internal Server Error",
              error: err.message,
          });
      }
      
      if (result.affectedRows > 0) {
          return response.status(200).json({
              success: true,
              message: "User rejected successfully",
          });
      } else {
          return response.status(200).json({
              success: false,
              message: "User not found or already processed",
          });
      }
  });
};


const getGatepassUserTotalCount = (request, response) => {

  const {society_id} = request.query;

  if(!society_id){
    return response.status(200).json({
      success: false,
      msg: languageMessages.msg_empty_param,
      key: "1",
    });
  }
  try {

    // "SELECT user_id, user_side, login_type, approve_flag, parkom_active_flag, gatepass_active_flag, user_type, f_name, l_name, username, name, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND user_side = 2 AND user_type = 1 AND otp_verify = 1 AND society_id = ? ORDER BY user_id DESC;";

    const sqlCheckUser =
      "SELECT count(user_id) as user_count FROM user_master WHERE delete_flag = 0 AND profile_completed = 1 AND user_type != 0 AND user_side = 2 AND user_type = 1 AND otp_verify = 1 AND society_id = ?";

    connection.query(sqlCheckUser, [society_id], async (err, userResult) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }

      if (userResult.length <= 0) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }

      if (userResult.length > 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          userResult: userResult,
        });
      }
    });
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
};


const SocietyAdminForgetPassword = async (request, response) => {
  const { email } = request.body;

  if (!email) {
    return response.status(200).json({
      success: false,
      msg: "Email is required.",
    });
  }

  try {
    // Query to fetch admin details by email
    const sql =
      "SELECT user_id, society_name, email FROM user_master WHERE email = ? AND user_type = 3 AND delete_flag = 0";

    connection.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return response.status(200).json({
          success: false,
          msg: "Database error occurred.",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return response.status(200).json({
          success: false,
          msg: "User not found for given email.",
          key: "email",
        });
      }

      const adminEmail = results[0].email;
      const adminName = results[0].society_name;
      const userId = results[0].user_id;
  
      // Set expiration time (15 minutes from now)
      const expirationTime = new Date(Date.now() + 15 * 60 * 1000);

      // Update expiration_time field in the database
      const updateSql = "UPDATE user_master SET expiration_time = ? WHERE email = ?";
      connection.query(updateSql, [expirationTime, email], async (updateErr) => {
        if (updateErr) {
          console.error("Error updating expiration time:", updateErr);
          return response.status(200).json({
            success: false,
            msg: "Failed to update expiration time.",
            error: updateErr.message,
          });
        }
   
        const uniqcode = uniqid(); // Generate unique identifier
        const md5Hash = crypto.createHash("md5").update(uniqcode).digest("hex");

        // Create reset link
        const resetLink = `https://meribhiapp.com/2024/parkom/society_panel/resetpassword?uniqcode=${md5Hash}`;

        connection.query(
          "INSERT INTO forgot_password_master (user_id, user_type, email, forgot_pass_identity, active_flag, createtime, updatetime) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [ userId, 0, adminEmail, md5Hash, 0],
          async (error) => {
            if (error) {
              return res.status(500).json({
                success: false,
                msg: languageMessage.internalServerError,
              });
            }
         
        // Generate email bodyAdminForgetNewPassword
        const subject = "Forgot Password";
        const app_name = "Parkom";
        const app_logo =
          "https://meribhiapp.com/2024/parkom/server/webservice/logo/logo.png";

        const mailBody = SocietymailBodyForgetPassword({
          adminName,
          adminEmail,
          subject,
          app_logo,
          app_name,
          resetLink, // Include reset link in email
        });

        // Send forget password email
        try {
          const mailRes = await SocietyForgetPasswordMail(adminEmail, subject, mailBody);

          if (mailRes.success) {
            return response.status(200).json({
              success: true,
              msg: "Forget password email sent successfully.",
              user_id: userId,
            });
          } else {
            return response.status(200).json({
              success: false,
              msg: "Failed to send forget password email.",
              error: mailRes.error,
            });
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          return response.status(200).json({
            success: false,
            msg: "Error sending forget password email.",
            error: emailError.message,
          });
        }
      });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return response.status(200).json({
      success: false,
      msg: "Unexpected error occurred.",
      error: error.message,
    });
  }
};


//get building details 
const getBuildingDetails = async (request, response) => {
  const { society_id } = request.query;

  try {
    if (!society_id) {
      return response.status(400).json({ success: false, msg: languageMessages.msg_empty_param, key: 'society_id' });
    }

    const checkSociety = 'SELECT society_name FROM user_master WHERE user_id = ? AND delete_flag = 0';
    connection.query(checkSociety, [society_id], async (err, res) => {
      if (err) {
        return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: err.message });
      }

      if (res.length === 0) {
        return response.status(404).json({ success: false, msg: 'Society not found' });
      }

    
      const sql = 'SELECT building_name, createtime FROM building_master WHERE society_id = ? AND delete_flag = 0';
      connection.query(sql, [society_id], async (err1, res1) => {
        if (err1) {
          return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: err1.message });
        }

        if (res1.length === 0) {
          return response.status(404).json({ success: false, msg: 'No buildings found' });
        }

        const building_arr = res1.map(data => ({
          building_name: data.building_name,
          createtime: moment(data.createtime).format("DD-MM-YYYY  hh:mm A")
        }));

        return response.status(200).json({ success: true, msg: languageMessages.msgDataFound, data: building_arr });
      });
    });
  } catch (error) {
    return response.status(500).json({ success: false, msg: languageMessages.internalServerError, error: error.message });
  }
};


//get guard details 
const getSocietyGuards = async( request, response) => {
  const { user_id} = request.query;
   try{
     if(!user_id){
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param, key:' user_id'});
     }

     const checkUser = 'SELECT user_id, active_flag FROM user_master WHERE user_id = ? AND delete_flag = 0';
     connection.query(checkUser, [user_id], async( err, res) => {
       if(err){
         return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: err.message});
       }

       if( res.length == 0){
        return response.status(200).json({ success: false, msg: languageMessages.msgUserNotFound});
       }

       const sql = 'SELECT um.email, um.name, um.society_id, um.mobile, um.createtime, um.shift, bm.building_name FROM user_master um JOIN building_master bm ON um.building_id = bm.building_id WHERE um.added_by = ? AND um.delete_flag = 0 '
       connection.query(sql, [ user_id], async( err1, res1) => {
         if(err1){
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: err1.message});
         }

         if(res1.length == 0){
          return response.status(200).json({ success: false, msg: 'No guards found'});
         }

         const guard_arrr = res1.map(data => ({
          name: data.name,
          email : data.email ? data.email : 'NA',
          mobile : data.mobile ? data.mobile : 'NA',
          shift : data.shift ? data.shift : 'NA',
          building_name : data.building_name ? data.building_name : 'NA',
          createtime: moment(data.createtime).format("DD-MM-YYYY  hh:mm A")
        }));

        return response.status(200).json({ success: true , msg: languageMessages.msgDataFound, data: guard_arrr});
     })
   })
  }
   catch(error){
    return response.status(200).json({ success: false, msg: languageMessages.internalServerError, error: error.message});
   }
}




// how many vehical added By User "vehical details"
const getVehicalDetails = async (request, response) => {
  const { user_id } = request.body;

  try {
      
            
    if (!user_id) {
       return response.status(200).json({
         
         success: false,

         msg: languageMessages.msg_empty_param,
  
         key: "user_id",
    });
  }
    const getVehicalQuery = () => {
      return new Promise((resolve, reject) => {
        const query = "SELECT vehical_id, model_name, plate_number, createtime FROM vehical_master WHERE user_id = ? AND delete_flag = 0";
        connection.query(query, [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    // Await the result of the query
    const vehicles = await getVehicalQuery();

    // If no vehicles are found, return a 404 response
    if (vehicles.length === 0) {
      return response.status(404).json({ success: false, msg: "Data Not Found", vehicle_arr: [] });
    }

    // Format the vehicle data and add s.no
    const vehicle_arr = vehicles.map((data, index) => ({
      s_no: index + 1, // Add serial number (starting from 1)
      vehical_id: data.vehical_id,
      model_name: data.model_name,
      plate_number: data.plate_number,
      createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
    }));

    // Return the formatted data
    return response.status(200).json({ success: true, msg: "Vehicle details fetched successfully", vehicle_arr: vehicle_arr });

  } catch (error) {
    // Handle any errors
    return response.status(500).json({ success: false, message: "Error fetching vehicle details", error: error.message });
  }
};

//Get Pre-Approved Guest
const getPreApprovedGuestDetails = async (request, response) => {
  const { user_id } = request.body;

  try {
      
           
    if (!user_id) {
       return response.status(200).json({
         
         success: false,

         msg: languageMessages.msg_empty_param,
  
         key: "user_id",
    });
  }

    const getGuestQuery = () => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT guest_id, name, mobile, vehical_number, flat_no, guest_type, createtime 
          FROM guest_master 
          WHERE delete_flag = 0 AND user_id = ?
        `;
        connection.query(query, [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const preapproved = await getGuestQuery();

    if (preapproved.length === 0) {
      return response.status(200).json({ success: false, msg: "Data Not Found", guast_pre_arr: [] });
    }

    const guestTypeMap = {
      1: "guest",
      2: "cab",
      3: "delivery",
      4: "visiting"
    };

    const guast_pre_arr = preapproved.map((data, index) => ({
      s_no: index + 1, 
      guest_id: data.guest_id,
      name: data.name,
      mobile: data.mobile,
      vehical_number: data.vehical_number,
      flat_no: data.flat_no,
      guest_type: guestTypeMap[data.guest_type] || "unknown",
      createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
    }));

   
    return response.status(200).json({ success: true, msg: "Pre-approved guest details fetched successfully", guast_pre_arr:guast_pre_arr });

  } catch (error) {
    // Handle any errors
    return response.status(500).json({ success: false, message: "Error fetching pre-approved guest details", error: error.message });
  }
};




//API for Fetch Visitor Details
const getVisitorDetails = async (request, response) => {
  const { user_id } = request.body;
  

  try {
      
    if (!user_id) {
       return response.status(200).json({
         
         success: false,

         msg: languageMessages.msg_empty_param,
  
         key: "user_id",
    });
  }
    const getVisitorQuery = () => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT grm.name, grm.mobile, grm.vehicle_no, grm.flat_no, grm.createtime, cm.category_name 
          FROM guard_request_master AS grm 
          JOIN category_master AS cm ON grm.category_id = cm.category_id 
          WHERE grm.delete_flag = 0 AND grm.status = 1 AND grm.owner_id = ?
        `;
        connection.query(query, [user_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const visitor = await getVisitorQuery();

    if (visitor.length === 0) {
      return response.status(404).json({ success: false, msg: "Data Not Found", visitor_arr: [] });
    }

    const visitor_arr = visitor.map((data, index) => ({
      s_no: index + 1, 
      name: data.name,
      mobile: data.mobile,
      vehicle_no: data.vehicle_no,
      flat_no: data.flat_no,
      category_name: data.category_name,
      createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
    }));

    return response.status(200).json({ success: true, msg: "Visitor details fetched successfully", visitor_arr });

  } catch (error) {
    return response.status(500).json({ success: false, message: "Error fetching visitor details", error: error.message });
  }
};


// API for Fetch Guard Side Visitor Details
const getGuardSideVisitorDetails = async (request, response) => {
    
  const { guard_id } = request.body;

  try {
    if (!guard_id) {
      return response.status(400).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "guard_id",
      });
    }

    const getVisitorQuery = () => {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT 
            grm.name AS guest_name, 
            grm.vehicle_no, 
            grm.flat_no, 
            grm.mobile, 
            grm.createtime, 
            cm.category_name, 
            um.name AS owner_name 
          FROM 
            guard_request_master AS grm 
          LEFT JOIN 
            category_master AS cm ON grm.category_id = cm.category_id 
          LEFT JOIN 
            user_master AS um ON grm.owner_id = um.user_id 
          WHERE 
            grm.delete_flag = 0 
            AND grm.guard_id = ?;
        `;
        connection.query(query, [guard_id], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    const visitor = await getVisitorQuery();

    if (visitor.length === 0) {
      return response.status(404).json({ 
        success: false, 
        msg: "Data Not Found", 
        visitor_arr: [] 
      });
    }

    const visitor_arr = visitor.map((data, index) => ({
      s_no: index + 1,
      guest_name: data.guest_name,
      owner_name: data.owner_name,
      mobile: data.mobile,
      vehicle_no: data.vehicle_no,
      flat_no: data.flat_no,
      category_name: data.category_name,
      createtime: moment(data.createtime).format("DD-MM-YYYY hh:mm A"),
    }));

    return response.status(200).json({ 
      success: true, 
      msg: "Visitor details fetched successfully", 
      visitor_arr 
    });

  } catch (error) {
    console.error("Error fetching visitor details:", error);
    return response.status(500).json({ 
      success: false, 
      message: "Error fetching visitor details", 
      error: error.message 
    });
  }
};


// API for Fetch Guard activity
const getGuardActivity = async (request, response) => {
    
  const { guard_id } = request.query;

  try {
    if (!guard_id) {
      return response.status(400).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "guard_id",
      });
    }

   const checksql = "SELECT g.guard_request_id ,g.guard_id ,g.category_id,g.mobile,g.name,g.vehicle_no,g.owner_id,g.flat_no ,g.status ,g.createtime,g.updatetime,c.category_name,u.name as owner_name FROM guard_request_master g JOIN category_master c ON c.category_id = g.category_id JOIN user_master u ON u.user_id = g.owner_id WHERE g.guard_id = ? AND g.delete_flag = 0 ORDER BY guard_request_id desc";
   connection.query(checksql,[guard_id],async(err,check) => {
    if (err) {
      return response.status(200).json({
        success: false,
        msg: languageMessages.internalServerError,
        err: err.message,
      });
    }
    if(check.length <= 0){
      return response.status(200).json({success : true,msg : languageMessages.msgDataNotFound,activity : "NA"})
    }
    check.map((item) => {
      item.createtime = moment(item.createtime).format("DD-MM-YYYY hh:mm A");
      item.updatetime = moment(item.updatetime).format("DD-MM-YYYY hh:mm A");
    })
    return response.status(200).json({success : true,msg : languageMessages.msgDataNotFound,activity : check});
   })

  } catch (error) {
    console.error("Error fetching visitor details:", error);
    return response.status(500).json({ 
      success: false, 
      message: "Error fetching visitor details", 
      error: error.message 
    });
  }
};

// API for Fetch Guard activity
const getGuardPreApproved = async (request, response) => {
    
  const { guard_id } = request.query;

  try {
    if (!guard_id) {
      return response.status(400).json({
        success: false,
        msg: languageMessages.msg_empty_param,
        key: "guard_id",
      });
    }

    const checksql = "SELECT  user_id ,user_type,building_id FROM user_master WHERE user_id = ? AND delete_flag = 0 AND user_type = 2";
    connection.query(checksql,[guard_id],async(err,check) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      if(check.length <= 0){
        return response.status(200).json({success : false,msg : languageMessages.msgDataNotFound,key : "guard"})
      }

      const building_id = check[0].building_id;

      const query = "SELECT  g.guest_id,g.guest_type,g.type,g.entry_type,g.user_id ,g.building_id ,g.flat_no,g.name,g.mobile,g.vehical_number,g.createtime,g.updatetime,u.name as owner_name FROM guest_master g JOIN user_master u ON u.user_id = g.user_id WHERE g.building_id = ? AND g.delete_flag = 0 ORDER by g.guest_id desc"
    
      connection.query(query,[building_id],async(err,result) => {
        if (err) {
          return response.status(200).json({
            success: false,
            msg: languageMessages.internalServerError,
            err: err.message,
          });
        }
        if(result.length <= 0){
          return response.status(200).json({success : true,msg : languageMessages.msgDataNotFound,preApproved : "NA"})
        }
        result.map((item) => {
          item.createtime = moment(item.createtime).format("DD-MM-YYYY hh:mm A");
          item.updatetime = moment(item.updatetime).format("DD-MM-YYYY hh:mm A");
          if(item.guest_type == 1){
            item.guest_type = "Guest"
          }else if(item.guest_type == 2){
            item.guest_type = "Cab"
          }else if(item.guest_type == 3){
            item.guest_type = "Delivery Boy"
          }else if(item.guest_type == 4){
            item.guest_type = "Visiting Help"
          }
        })
        return response.status(200).json({success : true,msg : languageMessages.msgDataNotFound,preApproved : result})
      })
    })

  } catch (error) {
    console.error("Error fetching visitor details:", error);
    return response.status(500).json({ 
      success: false, 
      message: "Error fetching visitor details", 
      error: error.message 
    });
  }
};


const getSocietyUserTabularReport = async (request,response) => {
  const {from_date,to_date, society_id} = request.query;
  try {

    if(!society_id){
      return response.status(200).json({success:false, msg: languageMessages.msg_empty_param, key: "society_id"})
    }
    if(!from_date) {
      return response.status(200).json({status:false, msg : languageMessages.msg_empty_param, key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({status:false, msg : languageMessages.msg_empty_param, key : "to_date"})
    }
    var sqlSelect = `SELECT user_id, login_type, user_type, f_name, name, l_name, username, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime 
    FROM user_master  WHERE delete_flag = 0 AND user_type = 1 AND profile_completed = 1 AND society_id = ?  AND Date(createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;

    connection.query(sqlSelect, [society_id, from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name: data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            active_flag_lable: (data.active_flag === 1) ? "active" : "deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
      // }
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}


const getSocietyTabularGuard = async (request,response) => {
  const {from_date,to_date, society_id} = request.query;
  try {

    if(!society_id){
      return response.status(200).json({success: true, msg: languageMessages.msg_empty_param, key: "society_id"})
    }
    if(!from_date) {
      return response.status(200).json({success:true,msg : languageMessages.msg_empty_param,key : "from_date"})
    }
    if(!to_date) {
      return response.status(200).json({success:true,msg : languageMessages.msg_empty_param,key : "to_date"})
    }

    var sqlSelect = `SELECT user_id, login_type, user_type, f_name, l_name, name, username, dob, age, phone_code, mobile, otp, otp_verify, email, password, image, latitude, longitude, zipcode, active_flag, gender, notification_status, instagram_id, createtime, updatetime 
    FROM user_master  WHERE delete_flag = 0 AND user_type = 2  AND society_id = ? AND Date(createtime) BETWEEN ? AND ?  ORDER BY user_id DESC`;

    connection.query(sqlSelect, [society_id, from_date, to_date], (err, result) => {
      if (err) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.internalServerError,
          err: err.message,
        });
      }
      
      var user_arr = [];


      if (result.length <= 0) {
        return response.status(200).json({
          success: true,
          msg: languageMessages.msgDataFound,
          user_arr: user_arr,
        });
      }

      // if (result.length > 0) {
        
      var s_no = 0;

      if (result.length > 0) {
        for (var data of result) {
          s_no++;

          user_arr.push({
            s_no: s_no,

            user_id: data.user_id,

            username: data.username,

            f_name: data.f_name,

            l_name: data.l_name,

            name: data.name,

            email: data.email,

            image: data.image,

            latitude: data.latitude,

            longitude: data.longitude,

            mobile: data.mobile,

            active_flag: data.active_flag,

            active_flag_lable: (data.active_flag === 1) ? "active" : "deactive",

            createtime: moment(data.createtime).format("DD-MM-YYYY HH:mm A"),
          });
        }

        return response.status(200).json({
          success: true,

          msg: languageMessages.msgDataFound,

          user_arr: user_arr.length > 0 ? user_arr : "NA",
        });
      };
      // }
    })
  } catch (error) {
    return response.status(200).json({
      success: false,
      msg: languageMessages.internalServerError,
      err: error.message,
    });
  }
}








module.exports = {

  fetchGuard,
  getallCategoryFetch,
  getGuardAnalyticalReports,
  getTabularGuard,
  editQuiz,
  addQuiz,
  deleteQuiz,
  getAllQuizQuestion,
  getBuildingTotalCount,
  addNewSocietyName,
  getBuildingNameDropdown,
  getSocietyNameDropdown,
  editSociety,
  getTotalSocietysCount,
  getGuardTotalCount,
  deleteSocity,
  getallSociety,
  editBuilding,
  addBuilding,
  getAllbuilding,
  deletebuilding,
  editGuard,
  getguardDetails,
  deleteGuard,
  addNewGuard,
  getAllGuardData,
  check,
  getAllDetails,
  
  getUserTotalCount,
  getCategoryTotalCount,
  getAllUserDataController,
 
  AdminForgetPassword,
  adminForgetNewPassword,
  ViewUserDetails,
  ViewSocietyDetails,
  getAllDeletedUser,
  ActivateDeactivateUser,
  DeleteUser,
  getAllCategory,
  addCategory ,
  deleteCategory ,
  editCategory,
  getAllQuestion,
  deleteQuestion,
  editQuestion,
  addQuestion,
  getContactUsData,
  updateStatus,
  SendMail,
  fetchaboutcontent,
  updateContent,
  getTabularUser,
  getAdminAllData,
  UpdateAdminPassword,
  UpdateAdminProfile,
  getUserAnalyticalReports,
  fetchUsers,
  sendBroadcastMessage,
  getAllFaqQuestion,
  deleteFaq,
  addFAQ,
  editFaq,
  getSubscription,
  addSubScription,
  deleteSubscription,
  getSubscriptionDetail,
  editSubscription,
  getCustomer,
  getUserSubscription,
  getCustomerQuestionAnswer,
  getCustomerDetail,
  getTotalEarnings,
  getTabularBusiness,
  getBusinessAnalyticalReports,
  getCustomerClamied,
  getUserAllSubscription,
  getTabularBusinessClaims,
  getBusinessAnalyticalReportsClaims,
  getTabularSubscription,
  getSubscriptionAnalyticalReports,
  getDeletedCustomer,
  getDeletdCustomerDetail,
  getDeletedCustomerQuestionAnswer,
  getAllCustomerClamied,
  CustomerStatusVerfy,
  getAdds,
  addAds,
  deleteAds,
  getAdsDetails,
  editAds,
  getBanner,
  addBanner,
  deleteBanner,
  editBanner,
  getAllParkomUser,
  getAllGatePassUser,
  getAllBothParkomandGatepassUser,
  FetchParkingHistory,

  addSocietyPanelByAdmin,
  getBuildingDetails,
  getSocietyGuards,
  getVehicalDetails,
  getPreApprovedGuestDetails,
  getVisitorDetails,
  getGuardSideVisitorDetails,



  // ************_______________Society__Panel_____________********************

  SocietyadminLogin,
  FetchAllGatepassUser,
  handleUserApproveRejectStatus,
  addBuildingBySocietyPanel,
  getAllSocietyPanelbuilding,
  getSocietyPanelBuildingNameDropdown,
  addNewGuardFromSocietyPanel,
  getAllGuardDataFromSocietyPanel,
  getSocietyAdminAllData,
  UpdateSocietyPanelAdminProfile,
  UpdateSocietyPanelPassword,
  getSocietyPanelAllData,
  activateDactivateSocietyPanel,
  getSocietyBuildingTotalCount,
  getSocietyGuardTotalCount,
  ActivateDeactivateSocietyUser,
  approveGatepassUser,
  rejectGatepassUser,
  getGatepassUserTotalCount,
  SocietyAdminForgetPassword,
  getGuardActivity,
  getGuardPreApproved,
  getSocietyUserTabularReport,
  getSocietyTabularGuard,

};
