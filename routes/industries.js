/** Routes for industries of BizTime. */

const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

/* get list of all industries */
router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT code, industry FROM industries`);
        let indData = results.rows;
        const compResults = await db.query(`SELECT comp_code, ind_code FROM companies_industries`);
        let compData = compResults.rows;
        for (const indRow of indData) {
            indRow.companies = [];
            // now check each company
            for (const compRow of compData) {
                // add matching companies to industry data
                if (compRow.ind_code == indRow.code) {
                    indRow.companies.push(compRow.comp_code);
                }
            }
        }
        return res.json({ industries: indData });
    } catch (err) { return next(err); }
});

/* add an industry */
router.post('/', async function (req, res, next) {
    try {
        const { code, industry } = req.body;

        const result = await db.query(`INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry]);

        return res.status(201).json({ industry: result.rows[0] });
    } catch (err) { return next(err); }
});

/* associate an industry with a company */
router.put('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const { comp_code } = req.body;
        const result = await db.query(`INSERT INTO companies_industries (comp_code, ind_code) VALUES ($1, $2) RETURNING comp_code, ind_code`, [comp_code, code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such industry: ${code}`, 404);
        } else {
            return res.json({ associated: result.rows[0] });
        }
    } catch (err) { return next(err); }
});

module.exports = router;