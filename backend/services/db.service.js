var mariadb = require('mariadb');



var dbServiceDef = () => {
    let pool = mariadb.createPool({
        host: 'localhost',
        user: process.env.DB_user,
        password: process.env.DB_password,
        database: 'dane_finansowe',
        connectionLimit: 5
    });

    var connect = async function() {
        let conn;
        try {
            conn = await pool.getConnection();
            return conn;
        } catch (err) {
            console.error(err.message);
        }
    };

    var disconnect = function(conn){
        if (conn) conn.end();
    };

    return {connect, disconnect}
};

var dbService = dbServiceDef();
module.exports = { dbService };
