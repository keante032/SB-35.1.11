/** Routes for companies of BizTime. */

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
        const result = await db.query(`SELECT code, name, description FROM companies`);
        return res.json({ companies: result.rows });
    } catch (err) {
        return next(err);
    }
});

router.get("/:code", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.post("/", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.put("/:code", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.delete("/:code", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

module.exports = router;