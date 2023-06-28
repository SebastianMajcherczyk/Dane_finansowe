var { dbService } = require('../services/db.service');
var controller = {
	// getAccounts: (req, res) => {
	// 	try {
	// 		const sql = 'SELECT * FROM PLAN_KONT';
	// 		dbService.connect().all(sql, (data, error) => {
	// 			dbService.disconnect();
	// 			if (error) {
	// 				return res.send(error);
	// 			}
	// 			return res.send(data);
	// 		});
	// 	} catch (error) {
	// 		return res.send(error);
	// 	}
	// },

	getAccounts: async (req, res) => {
		const createPlanKont = `CREATE TABLE KONTRAHENCI AS

		SELECT t1.NIPW, t1.NAZWADL
		FROM dane t1
		LEFT JOIN (
			SELECT NIPW, MAX(ID_POZPK) AS MaxID_POZPK
			FROM dane
			GROUP BY NIPW
		) t2 ON t1.NIPW = t2.NIPW AND t1.ID_POZPK = t2.MaxID_POZPK
		WHERE t1.NIPW IS NULL AND t1.NAZWADL IS NOT NULL
		OR t1.NIPW = t2.NIPW AND t1.NAZWADL IS NOT NULL`
}
}

module.exports = controller;
