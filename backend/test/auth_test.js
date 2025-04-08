const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile
} = require('../controllers/authController');

describe('Auth Controller', () => {
  afterEach(() => sinon.restore());

  describe('registerUser', () => {
    it('should register new user and return 201 with token', async () => {
      const req = { body: { name: 'John', email: 'john@example.com', password: 'pass' } };
      const fakeUser = { id: '123', name: 'John', email: 'john@example.com' };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(fakeUser);
      sinon.stub(jwt, 'sign').returns('fake-jwt');

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await registerUser(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.include({
        name: fakeUser.name,
        email: fakeUser.email,
        token: 'fake-jwt'
      });
    });

    it('should return 400 if user exists', async () => {
      const req = { body: { email: 'existing@example.com' } };
      sinon.stub(User, 'findOne').resolves({ email: 'existing@example.com' });

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await registerUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;
    });

    it('should return 500 on exception', async () => {
      const req = { body: { email: 'err@example.com' } };
      sinon.stub(User, 'findOne').throws(new Error('DB error'));

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await registerUser(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB error' })).to.be.true;
    });
  });

  describe('loginUser', () => {
    it('should log in valid user and return token', async () => {
      const req = { body: { email: 'test@example.com', password: 'test123' } };
      const fakeUser = {
        id: '123',
        name: 'Test',
        email: 'test@example.com',
        password: '$2b$10$fakehash'
      };

      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(jwt, 'sign').returns('fake-jwt');
      sinon.stub(require('bcrypt'), 'compare').resolves(true);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await loginUser(req, res);
      expect(res.json.calledOnce).to.be.true;
      expect(res.json.firstCall.args[0]).to.include({ email: fakeUser.email, token: 'fake-jwt' });
    });

    it('should return 401 for invalid password', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrong' } };
      sinon.stub(User, 'findOne').resolves({ email: 'test@example.com', password: 'hashed' });
      sinon.stub(require('bcrypt'), 'compare').resolves(false);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await loginUser(req, res);
      expect(res.status.calledWith(401)).to.be.true;
    });

    it('should return 401 if user not found', async () => {
      const req = { body: { email: 'nope@example.com', password: 'pass' } };
      sinon.stub(User, 'findOne').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await loginUser(req, res);
      expect(res.status.calledWith(401)).to.be.true;
    });
  });

  describe('getProfile', () => {
    it('should return user profile if found', async () => {
      const req = { user: { id: '123' } };
      const fakeUser = {
        name: 'Test',
        email: 'test@example.com',
        university: 'QUT',
        address: 'Brisbane'
      };
      sinon.stub(User, 'findById').resolves(fakeUser);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getProfile(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ name: fakeUser.name })).to.be.true;
    });

    it('should return 404 if user not found', async () => {
      const req = { user: { id: '123' } };
      sinon.stub(User, 'findById').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await getProfile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('updateUserProfile', () => {
    it('should update profile and return updated user', async () => {
      const req = {
        user: { id: '123' },
        body: {
          name: 'Updated',
          university: 'Updated Uni'
        }
      };
      const user = {
        name: 'Old',
        email: 'user@example.com',
        university: '',
        address: '',
        save: sinon.stub().resolvesThis(),
        id: '123'
      };

      sinon.stub(User, 'findById').resolves(user);
      sinon.stub(jwt, 'sign').returns('updated-token');

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateUserProfile(req, res);
      expect(user.name).to.equal('Updated');
      expect(user.university).to.equal('Updated Uni');
      expect(res.json.calledWithMatch({ token: 'updated-token' })).to.be.true;
    });

    it('should return 404 if user not found', async () => {
      const req = { user: { id: 'no-user' }, body: {} };
      sinon.stub(User, 'findById').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };

      await updateUserProfile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
