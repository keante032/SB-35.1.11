/** Routes for invoices of BizTime. */

const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

/* get list of all invoices */
router.get('/', async function (req, res, next) {
    try {
        const results = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (err) { return next(err); }
});

/* get one invoice */
router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const result = await db.query(
            `SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description
             FROM invoices AS i
             INNER JOIN companies AS c
             ON i.comp_code = c.code
             WHERE i.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        } else {
            const data = result.rows[0];
            const invoice = {
                id: data.id,
                amt: data.amt,
                paid: data.paid,
                add_date: data.add_date,
                paid_date: data.paid_date,
                company: {
                    code: data.code,
                    name: data.name,
                    description: data.description
                }
            }
            return res.json({ invoice: invoice });
        }
    } catch (err) { return next(err); }
});

/* add an invoice */
router.post('/', async function (req, res, next) {
    try {
        const { comp_code, amt } = req.body;

        const result = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);

        return res.status(201).json({ invoice: result.rows[0] });
    } catch (err) { return next(err); }
});

/* edit an invoice */
router.put('/:id', async function (req, res, next) {
    try {
        const { amt, paid } = req.body;
        const { id } = req.params;

        const currResult = await db.query(`SELECT paid FROM invoices WHERE id = $1`, [id]);

        if (currResult.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        } else {
            let paid_date;
            const currPaidDate = currResult.rows[0].paid_date;

            if (!currPaidDate && paid) {
                paid_date = new Date();
            } else if (!paid) {
                paid_date = null;
            } else {
                paid_date = currPaidDate;
            }

            const result = await db.query(`UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, paid, paid_date, id]);

            return res.json({ invoice: result.rows[0] });
        }
    } catch (err) { return next(err); }
});

/* delete an invoice */
router.delete('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const checkExists = await db.query(`SELECT id, amt, add_date FROM invoices WHERE id = $1`, [id]);
        const result = await db.query(`DELETE FROM invoices WHERE id = $1`, [id]);
        if (checkExists.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        } else {
            return res.json({ status: 'deleted' });
        }
    } catch (err) { return next(err); }
});

module.exports = router;