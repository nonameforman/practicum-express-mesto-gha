const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const postCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Введены некорректные данные: ${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      next(new NotFoundError('Такой карточки нет'));
      return;
    }
    if (!(String(card.owner) === req.user._id)) {
      next(new ForbiddenError('У вас нет доступа'));
      return;
    }
    const deletedCard = await Card.findByIdAndDelete(card);
    res.status(200).send(deletedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
    }
  }
};

const likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likedCard) {
      next(new NotFoundError('Такой карточки нет'));
      return;
    }
    res.status(200).send(likedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
    }
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislikedCard) {
      next(new NotFoundError('Такой карточки нет'));
      return;
    }
    res.status(200).send(dislikedCard);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError(`Введены некорректные данные: ${err.message}`));
    } else {
      next(err);
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
