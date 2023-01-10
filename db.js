/** Database setup for BizTime. */

const { Client } = require("pg");

// does NODE_ENV equal "test"? if so, use biztime_test; if not, use biztime
const DB_URI = (process.env.NODE_ENV === "test") ? "postgresql:///biztime_test" : "postgresql:///biztime";

let db = new Client({
    connectionString: DB_URI
});

async function db_connect() {
    await db.connect();
}

db_connect();

module.exports = db;