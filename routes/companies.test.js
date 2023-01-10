/* Must use the data.sql file to create the tables and values in biztime_test before running these tests--the expected results depend on that data. */

process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll(async function () {
    // close db connection
    await db.end();
})

describe('GET /companies', function () {
    test('Gets a companies list with Apple and IBM in it', async function () {
        const response = await request(app).get('/companies');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ companies: [{ code: 'apple', name: 'Apple Computer' }, { code: 'ibm', name: 'IBM' }] });
    })
})

describe('GET /companies/:code', function () {
    test('Gets an object for Apple', async function () {
        const response = await request(app).get('/companies/apple');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ company: { code: 'apple', name: 'Apple Computer', description: 'Maker of OSX.', invoices: [1, 2, 3] } });
    })
    test('Gets an object for IBM', async function () {
        const response = await request(app).get('/companies/ibm');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ company: { code: 'ibm', name: 'IBM', description: 'Big blue.', invoices: [4] } });
    })
    test('Gets a 404 for invalid company code', async function () {
        const response = await request(app).get('/companies/getfoo');
        expect(response.statusCode).toBe(404);
    })
})

describe('POST /companies', function () {
    test('Adds Microsoft', async function () {
        const response = await request(app).post('/companies').send({ code: 'msft', name: 'Microsoft', description: 'Maker of Windows.' });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({ company: { code: 'msft', name: 'Microsoft', description: 'Maker of Windows.' } });
    })
})

describe('PUT /companies/:code', function () {
    test('Edits Microsoft', async function () {
        const response = await request(app).put('/companies/msft').send({ name: 'Microsoft', description: 'Maker of the Zune.' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ company: { code: 'msft', name: 'Microsoft', description: 'Maker of the Zune.' } });
    })
    test('Gets a 404 for invalid company code', async function () {
        const response = await request(app).put('/companies/putfoo').send({ name: 'Foo', description: 'Bar.' });
        expect(response.statusCode).toBe(404);
    })
})

describe('DELETE /companies/:code', function () {
    test('Deletes Microsoft', async function () {
        const response = await request(app).delete('/companies/msft');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'deleted' });
    })
    test('Gets a 404 for invalid company code', async function () {
        const response = await request(app).delete('/companies/deletefoo');
        expect(response.statusCode).toBe(404);
    })
})