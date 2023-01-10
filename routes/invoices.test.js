/* Must use the data.sql file to create the tables and values in biztime_test before running these tests--the expected results depend on that data. */

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let newInvoiceId;

afterAll(async function () {
    // close db connection
    await db.end();
})

describe('GET /invoices', function () {
    test('Gets an invoices list with 4 invoices in it', async function () {
        const response = await request(app).get('/invoices');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ invoices: [{ id: 1, comp_code: 'apple' }, { id: 2, comp_code: 'apple' }, { id: 3, comp_code: 'apple' }, { id: 4, comp_code: 'ibm' }] });
    })
})

describe('GET /invoices/:id', function () {
    test('Gets an object for invoice 1', async function () {
        const response = await request(app).get('/invoices/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.invoice.id).toEqual(1);
        expect(response.body.invoice.amt).toEqual(100);
        expect(response.body.invoice.paid).toEqual(false);
        expect(response.body.invoice.paid_date).toEqual(null);
        expect(response.body.invoice.company).toEqual({ code: 'apple', name: 'Apple Computer', description: 'Maker of OSX.' });
    })
    test('Gets an object for invoice 4', async function () {
        const response = await request(app).get('/invoices/4');
        expect(response.statusCode).toBe(200);
        expect(response.body.invoice.id).toEqual(4);
        expect(response.body.invoice.amt).toEqual(400);
        expect(response.body.invoice.paid).toEqual(false);
        expect(response.body.invoice.paid_date).toEqual(null);
        expect(response.body.invoice.company).toEqual({ code: 'ibm', name: 'IBM', description: 'Big blue.' });
    })
})

describe('POST /invoices', function () {
    test('Adds 2nd invoice for IBM', async function () {
        const response = await request(app).post('/invoices').send({ comp_code: 'ibm', amt: 9000 });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            invoice:
            {
                id: expect.any(Number),
                comp_code: 'ibm',
                amt: 9000,
                paid: false,
                add_date: expect.anything(),
                paid_date: null
            }
        });
        newInvoiceId = response.body.invoice.id;
    })
})

describe('PUT /invoices/:id', function () {
    test('Edits the 2nd invoice for IBM', async function () {
        const response = await request(app).put(`/invoices/${newInvoiceId}`).send({ amt: 9001 });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            invoice:
            {
                id: expect.any(Number),
                comp_code: 'ibm',
                amt: 9001,
                paid: false,
                add_date: expect.anything(),
                paid_date: null
            }
        });
    })
    test('Gets a 404 for invalid invoice id', async function () {
        const response = await request(app).put(`/invoices/${newInvoiceId + 500}`).send({ amt: 50 });
        expect(response.statusCode).toBe(404);
    })
})

describe('DELETE /invoices/:id', function () {
    test('Deletes that 2nd invoice for IBM', async function () {
        const response = await request(app).delete(`/invoices/${newInvoiceId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'deleted' });
    })
    test('Gets a 404 for invalid invoice id', async function () {
        const response = await request(app).delete(`/invoices/${newInvoiceId + 500}`);
        expect(response.statusCode).toBe(404);
    })
})