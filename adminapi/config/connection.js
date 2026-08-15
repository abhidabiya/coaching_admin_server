var mysql = require("mysql");



const dotenv = require("dotenv");



dotenv.config();



var connection = mysql.createConnection({



    host : "localhost",

    user : "root",

    password : "",

    database : 'parkom_db'


});


connection.connect((err)=>{

    if(err) {

        console.log("errror database connection", err);

    }

    else{
        console.log("database connect successfully");
    }

});


module.exports = connection;