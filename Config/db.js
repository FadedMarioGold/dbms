const mysql = require('mysql');
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'dbms2',
});

module.exports = db;