var express = require("express");

const upload = require("../controller/multer");

const {
  
  getUserTotalCount,
  getCategoryTotalCount,
  getAllUserDataController,
  ViewUserDetails, 
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
  SendMail,
  updateStatus,
  fetchaboutcontent,
  updateContent,
  getTabularUser,
  getAdminAllData,
 
  getUserAnalyticalReports,
  fetchUsers,
  sendBroadcastMessage,
  getAllFaqQuestion,
  deleteFaq,
  addFAQ,
  addQuiz,
  editFaq,
 
  getTabularBusiness,
  getBusinessAnalyticalReports,

  getTabularBusinessClaims,
  getBusinessAnalyticalReportsClaims,
  getTabularSubscription,
 
  CustomerStatusVerfy,getAdds,addAds,deleteAds,getAdsDetails,editAds,getBanner,addBanner,deleteBanner,editBanner,

  // ***********************************************
  check,
  getAllDetails,
  getAllGuardData,
  addNewGuard,
  deleteGuard,
  getguardDetails,
  editGuard,
  getAllbuilding,
  deletebuilding,
  addBuilding,
  editBuilding,
  getallSociety,
  deleteSocity,
  getGuardTotalCount,
  getTotalSocietysCount,
  editSociety,
  getSocietyNameDropdown,
  getBuildingNameDropdown,
  addNewSocietyName,
  getBuildingTotalCount,
  getAllQuizQuestion,
  deleteQuiz,
  editQuiz,
  getTabularGuard,
  getGuardAnalyticalReports,
  fetchGuard,
  getallCategoryFetch,
  getAllParkomUser,
  getAllGatePassUser,
  getAllBothParkomandGatepassUser,
  FetchParkingHistory,


  addSocietyPanelByAdmin,
  ViewSocietyDetails,
  getVehicalDetails,
  getPreApprovedGuestDetails,
  getVisitorDetails,
  getGuardSideVisitorDetails,

  // ________________Society__Panel________________

  SocietyadminLogin,
  
  
} = require("../controller/adminController");


const adminLoginapi = require("../controller/adminLogin");
const CourseController = require("../controller/CourseController");
const studentController = require("../controller/studentController");

const fecultyExpenceController = require("../controller/fecultyController.js")


var route = express.Router();


// --------------------------My Code Start Here--------------------------


//######################## --- Admin Code --- #########################


route.post("/admin_login",upload.none(), adminLoginapi.adminLoginController);

route.post("/Check_admin_email",upload.none(), adminLoginapi.CheckAdminEmail); 

route.post("/Admin_forget_password", upload.none(), adminLoginapi.AdminForgetPassword);

route.post("/admin_forget_new_password", upload.none(), adminLoginapi.adminForgetNewPassword);

route.post("/update_admin_password",upload.none(), adminLoginapi.UpdateAdminPassword);

route.post("/edit_admin_profile",upload.single("image"), adminLoginapi.UpdateAdminProfile);


// ######################### --- Inquary Code --- #########################


route.get("/disha_check", adminLoginapi.dishaCheck);


// --------------------------My Code end Here--------------------------







// -------------------------------Course Code Start Here-------------------------------
// Protect routes that need authentication
// In your router.js file, add these imports
// Course Management Routes
route.post("/add_course", upload.single("image") , CourseController.addNewCourse);
route.get("/get_all_courses", CourseController.getAllCourses);
route.get("/get_course/:id", CourseController.getCourseById);
route.put("/update_course/:id", upload.fields([{ name: "image" }]), CourseController.updateCourse);
route.delete("/delete_course/:id", upload.none(), CourseController.deleteCourse);
route.post("/toggle_course_status/:id", upload.none(), CourseController.toggleCourseStatus);
route.get("/course_categories", CourseController.getCourseCategories);
route.get("/course_statistics", CourseController.getCourseStatistics);
route.get("/search_courses", CourseController.searchCourses);
route.get("/featured_courses", CourseController.getFeaturedCourses);
route.get("/course_dropdown", CourseController.getCourseDropdown);
route.post("/add_course_category", upload.none(), CourseController.addCourseCategory);
  


// Student Admission/Enquiry Routes
route.post("/create_student_record", upload.none(), studentController.createStudentRecord);
route.get('/get_all_student_data', studentController.getAllUsers); // Get all users with pagination & filters
// 2️⃣ Get single user by ID
route.get('/get_student/:id', studentController.getUserById);

// 3️⃣ Update student / enquiry record
route.put('/update_student/:id', studentController.updateStudentRecord);

// 4️⃣ Convert enquiry → admission
route.put('/convert_enquiry/:id', studentController.convertEnquiryToAdmission);

// 5️⃣ Soft delete user
route.delete('/delete_student/:id', studentController.deleteUser);

// 6️⃣ Activate / Deactivate user (Parkom / Gatepass)
route.put('/update_user_status', studentController.activateDeactivateUser);

// 7️⃣ Student statistics dashboard
route.get('/student_statistics', studentController.getStudentStatistics);

// 8️⃣ Get course list (dropdown)
route.get('/course_list', studentController.getCoursesList);

// 9️⃣ Update follow-up details
route.put('/update_followup/:id', studentController.updateFollowup);








// -------------------------------------------Expense API's-------------------------------------------


route.post("/addexpense" , fecultyExpenceController.addexpense);
route.get("/getallexpense" , fecultyExpenceController.getallexpense);
route.put("/editexpense/:id" , fecultyExpenceController.editexpense);
route.delete("/deletexpense/:id" , fecultyExpenceController.deletexpense);
route.get("/getoneexpense/:id", fecultyExpenceController.getoneexpense)

// ------------------------------------------------Faculty APIS-----------------------------------


route.post("/facultyadd" , fecultyExpenceController.Facultyadd);
route.get("/getallfacultys" , fecultyExpenceController.getallFacultys );
route.put("/editfaculty/:id" , fecultyExpenceController.editFaculty);
route.delete("/deletefaculty/:id" , fecultyExpenceController.deleteFaculty);
route.get("/getonedataFaculty/:id" , fecultyExpenceController.getonedataFaculty)



// Get User Analiytical Reports

route.get("/users_analytical_report", getUserAnalyticalReports);
route.get("/get_tabular_user",getTabularUser);




























































































































// OLD API Code



route.post("/get_all_guard_side_visitor_details", upload.none(), getGuardSideVisitorDetails);

route.post("/get_all_visitor_details", upload.none(), getVisitorDetails);

route.post("/get_all_preapproved_guest", upload.none(), getPreApprovedGuestDetails);

route.post("/get_all_vehical", upload.none(), getVehicalDetails);

route.post("/delete_society",upload.none(), deleteSocity);

route.get("/get_all_society",getallSociety);

route.post("/get_all_parking_history", upload.none(), FetchParkingHistory);

route.get("/get_all_category_fetch",getallCategoryFetch);

route.get("/get_building_total_count",getBuildingTotalCount);

route.get("/get_society_name",getSocietyNameDropdown);

route.get("/get_building_name",getBuildingNameDropdown);

route.get("/get_total_society_count",getTotalSocietysCount);

route.get("/get_all_bulidng",getAllbuilding);

route.post("/delete_guard",upload.none(), deleteGuard);

route.post("/add_new_guard", upload.single("image"),addNewGuard);

route.get("/get_all_guard",getAllGuardData);


route.post("/society_admin_login",upload.none(),SocietyadminLogin);

route.get("/get_admin_data",getAdminAllData);

route.get("/get_user_total_count",getUserTotalCount);

route.get("/get_guard_total_count",getGuardTotalCount);

route.get("/get_category_total_count",getCategoryTotalCount);

route.get("/get_all_user_data",getAllUserDataController);

route.get("/get_all_parkom_user_data",getAllParkomUser);

route.get("/get_all_gatepass_user_data",getAllGatePassUser);

route.get("/get_both_parkom_gatepass_user_data",getAllBothParkomandGatepassUser);






route.get("/get_user_data/:user_id",ViewUserDetails);

route.get("/get_society_data/:user_id",ViewSocietyDetails);



route.get("/Users", fetchUsers);

route.get("/guards", fetchGuard);

route.post("/send_broadcast", upload.none(), sendBroadcastMessage);

route.get("/get_deleted_all_user_data",getAllDeletedUser);

route.post("/ActivateDeactivateUser", upload.none(), ActivateDeactivateUser);

route.post("/deleteUser", upload.none(), DeleteUser);

route.get("/fetchaboutcontent", fetchaboutcontent);

route.post("/updateContent", upload.none(), updateContent);

route.get("/get_contact_us",getContactUsData);

route.post("/update_status", upload.none(), updateStatus);

route.post("/send_mail", upload.none(), SendMail);

route.get("/get_adds",upload.none(),getAdds);

route.post("/add_ads",upload.fields([{name : "image"},{name : "video"}]),addAds);

route.post("/delete_ads",upload.none(),deleteAds);

route.get("/get_ads_details",upload.none(),getAdsDetails);

route.get("/get_guard_details",upload.none(),getguardDetails);

route.post("/edit_ads",upload.fields([{name : "image"},{name : "video"}]),editAds);

route.get("/get_banner",getBanner);

route.post("/add_banner",upload.fields([{name : "image"}]),addBanner);

route.post("/delete_banner",upload.none(),deleteBanner);

route.post("/edit_banner",upload.fields([{name : "image"}]),editBanner);


// ----------------------------------------------------------------






route.get("/get_category",getAllCategory);

route.post("/AddCategory",upload.none(),addCategory );

route.post("/delete_category",upload.none(),deleteCategory );

route.post('/edit_category', upload.none(), editCategory);



route.get("/get_tabular_guard",getTabularGuard);

route.get("/get_tabular_subscription",getTabularSubscription);

route.get("/get_tabular_business",getTabularBusiness);

route.get("/get_tabular_business_claims",getTabularBusinessClaims);



route.get("/guard_analytical_report", getGuardAnalyticalReports);






route.get("/business_analytical_report_claims", getBusinessAnalyticalReportsClaims);
route.get("/business_analytical_report", getBusinessAnalyticalReports);



route.post("/add_question",upload.none(),addQuestion);
route.post("/edit_question",upload.none(),editQuestion);
route.post("/delete_question",upload.none(),deleteQuestion);
route.get("/get_all_question",getAllQuestion);



route.get("/get_all_faq",getAllFaqQuestion);
route.post("/delete_faq",upload.none(),deleteFaq);
route.post("/add_faq",upload.none(),addFAQ);
route.post("/edit_faq",upload.none(),editFaq);


route.post("/add_quiz",upload.none(),addQuiz);
route.post("/delete_quiz",upload.none(),deleteQuiz);
route.post("/edit_quiz",upload.none(),editQuiz);
route.get("/get_all_quiz",getAllQuizQuestion);

// **************************************************************************************



module.exports = route;


