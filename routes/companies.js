/** Routes for companies of BizTime. */

const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');
const slugify = require('slugify');

/* get list of all companies */
router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
        return res.json({ companies: results.rows });
    } catch (err) { return next(err); }
});

/* get one company */
router.get('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const compResult = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code = $1`,
            [code]
        );
        const invResult = await db.query(
            `SELECT id
             FROM invoices
             WHERE comp_code = $1`,
            [code]
        );
        const indResult = await db.query(
            `SELECT i.industry
             FROM companies_industries AS ci
             INNER JOIN industries AS i
             ON ci.ind_code = i.code
             WHERE ci.comp_code = $1`,
            [code]
        );
        if (compResult.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        } else {
            const company = compResult.rows[0];
            const invoices = invResult.rows;
            const industries = indResult.rows;
            if (invoices.length === 0) {
                company.invoices = [];
            } else {
                company.invoices = invoices.map(inv => inv.id);
            }
            if (industries.length === 0) {
                company.industries = [];
            } else {
                company.industries = industries.map(ind => ind.industry);
            }
            return res.json({ company: company });
        }
    } catch (err) { return next(err); }
});

/* add a company */
router.post('/', async function (req, res, next) {
    try {
        const { name, description } = req.body;
        const code = slugify(name, { lower: true, strict: true });

        const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);

        return res.status(201).json({ company: result.rows[0] });
    } catch (err) { return next(err); }
});

/* edit a company */
router.put('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code = $3 RETURNING code, name, description`, [name, description, code]);
        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        } else {
            return res.json({ company: result.rows[0] });
        }
    } catch (err) { return next(err); }
});

/* delete a company */
router.delete('/:code', async function (req, res, next) {
    try {
        const { code } = req.params;
        const checkExists = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
        const result = await db.query(`DELETE FROM companies WHERE code = $1`, [code]);
        if (checkExists.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        } else {
            return res.json({ status: 'deleted' });
        }
    } catch (err) { return next(err); }
});

module.exports = router;