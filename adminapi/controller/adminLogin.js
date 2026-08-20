var connection = require("../config/connection");

var languageMessages = require("./languageMessage");

var crypto = require("crypto");

const rs = require("randomstring");

const jwt = require("jsonwebtoken");

var moment = require("moment");

const randomstring = require("randomstring");

const uniqid = require("uniqid");

const { ForgetPasswordMail, mailBodyForgetPassword } = require("./mailer.js");




const dishaCheck = (req, res) => {

  return res.status(200).json({
    success : true,
    msg : "Disha API is working fine",
    key : "disha_api_working ............"
  })

}





async function hashPassword(pass) {

  return crypto.createHash("md5").update(pass).digest("hex");

}


const adminLoginController = async (request, response) => {

    const { email, password } = request.body;
  
    try {
      if (!email) {
        return response.status(200).json({
          success: false,
          msg: languageMessages.msg_empty_param,
          key: "email Write",
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
        "SELECT user_id,email,username, password, user_id, active_flag, mobile,user_type FROM user_master WHERE email = ? AND delete_flag = 0 AND user_type = 0";
  
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
  
const CheckAdminEmail = async (request, response) => {
  
    const { email } = request.body;
  
    if (!email) {
      return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param });
    }
  
    try {
      var check =
        "SELECT email FROM user_master WHERE email = ? AND user_type = 0 AND delete_flag = 0";
  
      connection.query(check, [email], async (err, res) => {
        if (err) {
          return response.status(200).json({ success: false, msg: languageMessages.internalServerError });
        }
  
        if (res.length <= 0) {
          return response.status(200).json({ success: false, msg: languageMessages.msgDataNotFound });
        }
  
        if (res.length > 0) {
          return response.status(200).json({
            success: true,
  
            msg: languageMessages.msgDataFound,
  
            res: res[0].email,
          });
        } else {
          return response
  
            .status(200)
  
            .json({ success: false, msg: languageMessages.msgDataNotFound });
        }
      });
    } catch (error) {
      return response.status(200).json({
        success: false,
  
        msg: languageMessages.internalServerError,
  
        error,
      });
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
                  msg: languageMessages.internalServerError,
                });
              }
           
          // Generate email bodyAdminForgetNewPassword
          const subject = "Forgot Password";
          const app_name = "CoachingDesk";
          const app_logo = "http://localhost:3003/logo/logo.jpg"
           
  
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
  
        console.log(info[0].user_id);
  
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
  
            console.log(password);
  
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


const UpdateAdminProfile = async (request, response) => {
    const { name, email } = request.body;
    try {
      let image = request.file ? request.file.filename : null;
  
      if (!name || !email) {
        return response.status(200).json({ success: false, msg: languageMessages.msg_empty_param });
      }
  
      let updateQuery = "UPDATE user_master SET username = ?, name = ?, f_name = ?, email = ?";
      let params = [name, name, name, email];
  
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

  module.exports = {
    adminLoginController, CheckAdminEmail, AdminForgetPassword, adminForgetNewPassword, UpdateAdminPassword, UpdateAdminProfile,  dishaCheck
  }