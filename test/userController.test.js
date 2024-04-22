const { expect } = require('chai');
const { request } = require('chai-http');

let server;

before(async function() {
  const appModule = await import('../app.js');
  server = appModule.default;
});

describe('getLogin', function() {
  it('should render the login page', async function() {
    const res = await request(server).get('/user/login');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('login');
  });
});

describe('postLogin', function() {
  it('should redirect to / on successful login', async function() {
    const res = await request(server).post('/user/login').send({ email: ' ', password: ' ' });
    expect(res.status).to.equal(200);
    expect(res.text).to.include('You are now logged in');
  });
});
