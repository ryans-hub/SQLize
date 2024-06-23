const mysql = require ('mysql2');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employee_db',
    },
    console.log('Connected to DB')
)

module.exports = connection;