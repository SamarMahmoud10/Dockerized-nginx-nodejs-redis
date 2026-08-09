const request = require('supertest');
const app = require('./server.js'); 

jest.mock('redis', () => ({
  createClient: () => ({
    get: (key, callback) => callback(null, "5"), 
    set: (key, value) => null
  })
}));

describe('GET /', () => {
  it('should respond with html and status 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Container Metrics'); 
  });
});
