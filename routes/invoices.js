/** Routes for invoices of BizTime. */

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async function (req, res, next) {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: result.rows });
    } catch (err) {
        return next(err);
    }
});

router.get("/:id", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.post("/", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.put("/:id", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async function (req, res, next) {
    try { } catch (err) {
        return next(err);
    }
});

module.exports = router;