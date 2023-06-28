// const { LIMIT_ATTACHED } = require('sqlite3');
var Validators = require('sql-validator');
var { dbService } = require('../services/db.service');

const validator = new Validators();
var validationDefinitionMap = {
	dateFrom: validator.check().dataType('isDate'),
	dateTo: validator.check().dataType('isDate'),

	NIPW: {
		dateType: 'isString',
		lengthBetween: {
			min: 3,
			max: 12,
		},
	},
};

const validateRequest = (req, res, next) => {
	const { NIPW, dateFrom, dateTo } = req.query;
	const isValid = validator.isValid(
		{ NIPW, dateFrom, dateTo },
		validationDefinitionMap
	).valid;

	if (!isValid) {
		return next({ status: 400, message: 'Bad Request' });
	}

	next();
};

var controller = {
	getData: [
		validateRequest,
		async (req, res, next) => {
			try {
				const { NIPW, dateFrom, dateTo } = req.query;
				let sql =
					'SELECT * FROM new_dane WHERE DATA_ZAKS BETWEEN DATE(?) AND DATE(?)';
				let params = [dateFrom, dateTo];

				if (NIPW) {
					sql =
						'SELECT * FROM new_dane WHERE NIPW = ? AND DATA_ZAKS BETWEEN DATE(?) AND DATE(?)';
					params.unshift(NIPW);
				}

				let conn;
				try {
					conn = await dbService.connect();
					const data = await conn.query(sql, params);
					res.send(data);
				} finally {
					dbService.disconnect(conn);
				}
			} catch (error) {
				next(error);
			}
		},
	],
	getAccountsReceivableSummary: async (req, res, next) => {
		try {
			let sql = `SELECT t1.KONTOWN, t1.NAZWADL, t1.SUM_KWOTAPLN AS "SUMA WN", t2.*
			FROM
				(SELECT KONTOWN, NAZWADL , SUM(KWOTAPLN) as SUM_KWOTAPLN
				FROM new_dane 
				WHERE NR_WN = '200'
				AND (NR_MA NOT LIKE '1%' OR NR_MA IS NULL)
				AND ID_DEFDOK NOT IN("700","701","702","703")
				GROUP BY KONTOWN) t1
			LEFT JOIN
				(SELECT KONTOMA, SUM(KWOTAPLN) AS "SUMA MA"
				FROM new_dane
				WHERE NR_MA = '200'
				AND (NR_WN NOT LIKE '1%' OR NR_WN IS NULL)
				AND ID_DEFDOK NOT IN("700","701","702","703")
				GROUP BY KONTOMA) t2
			ON t1.KONTOWN = t2.KONTOMA`;

			let conn;
			try {
				conn = await dbService.connect();
				const data = await conn.query(sql);

				res.send(data);
			} finally {
				dbService.disconnect();
			}
		} catch (error) {
			next(error);
		}
	},
	getAccountsReceivable: async (req, res, next) => {
		try {
			let sql = ` SELECT ID_POZPK, DATA_ZAKS, KONTOWN, NAZWADL , KWOTAPLN AS KWOTAPLN_WN, NULL AS KWOTAPLN_MA, OPIS
			FROM new_dane 
			WHERE NR_WN = '200'
			AND (NR_MA NOT LIKE '1%' OR NR_MA IS NULL)
			AND ID_DEFDOK NOT IN("700","701","702","703")
			UNION ALL
			SELECT ID_POZPK,DATA_ZAKS, KONTOMA, NAZWADL, NULL AS KWOTAPLN_WN, KWOTAPLN AS KWOTAPLN_MA, OPIS
			FROM new_dane 
			WHERE NR_MA = '200'    
			AND (NR_WN NOT LIKE '1%' OR NR_WN IS NULL)
			AND ID_DEFDOK NOT IN("700","701","702","703")
			`;

			let conn;

			try {
				conn = await dbService.connect();
				const data = await conn.query(sql);

				res.send(data);
			} finally {
				dbService.disconnect();
			}
			
		} catch (error) {
			next(error);
		}
	},
};

module.exports = controller;
