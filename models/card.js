const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле является обязательным'],
    minlength: [2, 'Минимальное кол-во символов: 2'],
    maxlength: [30, 'Максимальное кол-во символов: 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле является обязательным'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Ошибка при вводе URL',
    },
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'Поле является обязательным'],
    ref: 'user',
  },
  likes: [{
    type: mongoose.SchemaTypes.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
