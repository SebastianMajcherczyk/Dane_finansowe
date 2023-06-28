// var sqlite3 = require('sqlite3').verbose();

// var dbServiceDef = () => {
// 	let db = null;
    
// 	var connect = function() {
// 		 db = new sqlite3.Database('../DB/DANE.sqlite3', err => {
// 			if (err) {
// 				return console.error(err.message);
// 			}
// 		});
//         return db;
// 	};

// 	var disconnect = function(){
//         db?.close()
//     };

//     return {connect, disconnect}
// };

// var dbService = dbServiceDef();
// module.exports = { dbService };
