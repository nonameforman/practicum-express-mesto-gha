const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const usersRouter = express.Router();

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:userId', getUserById);
usersRouter.post('/users', createUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
