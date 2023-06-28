var { dbService } = require('../services/db.service');

var controller = {
    getContractors: async (req, res) => {
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS KONTRAHENCI (
                NIPW VARCHAR(255),
                NAZWADL VARCHAR(255)
            )
        `;

        const updateTableSql = `
            INSERT INTO KONTRAHENCI (NIPW, NAZWADL)
            SELECT t1.NIPW, t1.NAZWADL
            FROM new_dane t1
            LEFT JOIN (
                SELECT NIPW, MAX(ID_POZPK) AS MaxID_POZPK
                FROM new_dane
                GROUP BY NIPW
            ) t2 ON t1.NIPW = t2.NIPW AND t1.ID_POZPK = t2.MaxID_POZPK
            LEFT JOIN KONTRAHENCI k ON t1.NIPW = k.NIPW
            WHERE ((t1.NIPW IS NULL AND t1.NAZWADL IS NOT NULL) 
            OR (t1.NIPW = t2.NIPW AND t1.NAZWADL IS NOT NULL)) 
            AND k.NIPW IS NULL
        `;

        let conn;
        try {
            conn = await dbService.connect();
            await conn.query(createTableSql);
            await conn.query(updateTableSql);
            const data = await conn.query('SELECT * FROM KONTRAHENCI');
            return res.send(data);
        } catch (err) {
            return res.send(err);
        } finally {
            dbService.disconnect(conn);
        }
    },
};

module.exports = controller;
