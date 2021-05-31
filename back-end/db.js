const mysql = require("mysql");
const config = require("./config");

class DB {
  // static con;

  static getFilters() {
    return new Promise((resolve, reject) => {
      DB.pool.getConnection(function (err, connection) {
        if (err) reject(err);
        let filters = {};

        let sqlBrand = `SELECT  DISTINCT brand, screen_type, screen_size, resolution, voltage   FROM item `;

        connection.query(sqlBrand, function (err, result) {
          if (err) reject(err);

          result.forEach((e) => {
            Object.entries(e).forEach(([key, value]) => {
              const v = filters[key] || [];

              filters[key] = Array.from(new Set([...v, value]));
            });
          });

          resolve(filters);
        });
      });
    });
  }

  static listAll(param) {
    return new Promise((resolve, reject) => {
      DB.pool.getConnection(function (err, connection) {
        if (err) reject(err);

        let query = Object.entries(param)
          .map(([key, value]) => {
            const parsed = value.map((v) => `'${v}'`);

            return `${key} IN (${parsed}) `;
          })
          .join("AND ");

        let sql = `SELECT *  FROM item ${query && "WHERE"} ${query}`;

        connection.query(sql, function (err, result) {
          if (err) reject(err);

          resolve(result);
        });
      });
    });
  }
}

if (!DB.pool) DB.pool = mysql.createPool(config);

module.exports = DB;
