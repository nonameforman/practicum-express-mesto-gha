const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Ошибка при вводе URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
