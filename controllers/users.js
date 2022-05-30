const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка в работе сервера' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).send({ message: 'Такого пользователя нет' });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: `Введены некорректные данные: ${err.message}`,
      });
    } else {
      res.status(500).send({ message: 'Ошибка в работе сервера' });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: `Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`,
      });
    } else {
      res.status(500).send({ message: 'Ошибка в работе сервера' });
    }
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedProfile = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedProfile) {
      res.status(404).send({ message: 'Такого пользователя нет' });
    } else {
      res.status(200).send(updatedProfile);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: `Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`,
      });
    } else {
      res.status(500).send({ message: 'Ошибка в работе сервера' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!updatedAvatar) {
      res.status(404).send({ message: 'Такого пользователя нет' });
    } else {
      res.status(200).send(updatedAvatar);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: `Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`,
      });
    } else {
      res.status(500).send({ message: 'Ошибка в работе сервера' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
