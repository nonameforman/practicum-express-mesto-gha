const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Ошибка в работе сервера' });
  }
};

const postCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: `Введены некорректные данные: ${err.errors.name.message}`,
      });
    } else {
      res.status(500).send({ message: 'Ошибка в работе сервера' });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
    if (!deletedCard) {
      res.status(404).send({ message: 'Такой карточки нет' });
    } else {
      res.status(200).send(deletedCard);
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

const likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likedCard) {
      res.status(404).send({ message: 'Такой карточки нет' });
    } else {
      res.status(200).send(likedCard);
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

const dislikeCard = async (req, res) => {
  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislikedCard) {
      res.status(404).send({ message: 'Такой карточки нет' });
    } else {
      res.status(200).send(dislikedCard);
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

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
