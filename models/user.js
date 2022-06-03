const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Ошибка при вводе URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле является обязательным'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Ошибка при вводе email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле является обязательным'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
