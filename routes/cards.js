const express = require('express');
const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardsRouter = express.Router();

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', postCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardsRouter;
