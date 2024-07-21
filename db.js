const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "evalugusta",
  password: "Software7@!!",
  port: 5432,
});

module.exports = pool;
