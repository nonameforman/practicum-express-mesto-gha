const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');

const saltRounds = 10;
const mongoError = 11000;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
    }
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Не введен логин/пароль'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    let user = await User.create({
      name, about, avatar, email, password: hash,
    });
    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      return;
    }
    if (err.code === mongoError) {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Не введен логин/пароль'));
    return;
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Пользователь не найден'));
      return;
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неправильный email/пароль');
    }
    const token = await jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedProfile = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedProfile) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(200).send(updatedProfile);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedAvatar) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(200).send(updatedAvatar);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateProfile,
  updateAvatar,
};
