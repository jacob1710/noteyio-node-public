// test.js

const server = require('../index');
const supertest = require('supertest');
const mongoose = require('mongoose');


beforeAll((done) => {
    done();
});

afterAll(async() => {
    // Closing the DB connection allows Jest to exit successfully.
    await mongoose.connection.close();
    server.close();
    // done();
});

describe('Jest testing ', () => {
    it('Testing to see if Jest works', () => {
        expect(1).toBe(1);
    });
});

describe('Alive route testing', () => {
    it('GET /alive should show the current time', async() => {
        const res = await supertest(server).get('/api/alive');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('time');
    });
});

describe('Testing corretly denied request auth privelages', () => {
    it('GET /api/users/get?firebaseId=abcdefg', async() => {
        const res = await supertest(server).get('/api/users/get?firebaseId=maBHZsWh0WhC0YgxyZwcAo2JLYf2');
        expect(res.status).toEqual(401);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('error');
    });
});

// it('GET /user/:id should show a user', async () => {
//   const res = await requestWithSupertest.get('/users/3');
//   expect(res.statusCode).toEqual(200);
//   expect(res.body).toHaveProperty('user3');
// });