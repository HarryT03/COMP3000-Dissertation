const expect = require('chai').expect;
const sinon = require('sinon');
const userController = require('../server/controllers/userController');

describe('user Controller', function() {
    it('should have a function to get the homepage', function() {
        expect(userController.homepage).to.be.a('function');
    });

    // More tests here...
});