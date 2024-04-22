const { expect } = require('chai');
const { request } = require('chai-http');

let server;

before(async function() {
  const appModule = await import('../app.js');
  server = appModule.default;
});

describe('getRecipe', function() {
  it('should render the recipe page', async function() {
    const res = await request(server).get('/recipe/661fea309a0ac0f64dca9f3e');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('recipe');
  });
});

describe('postRecipe', function() {
  it('should redirect to / on successful recipe creation', async function() {
    const res = await request(server).post('/recipe').send({ title: ' ', description: ' ', ingredients: [], steps: [] });
    expect(res.status).to.equal(200);
    expect(res.text).to.include('Recipe created successfully');
  });
});