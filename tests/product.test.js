const request = require('supertest');
const app = require('../server-test');

describe("GET products",()=>{
    test("Should return all product", async()=>{
        return request(app).get(`/v1/api/products/`)
        .expect(200)
        .expect('content-type',/application\/json/)
    })
})
