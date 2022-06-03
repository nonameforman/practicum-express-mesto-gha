const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const handleError = require('./middlewares/handleError');
const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  app.listen(PORT);
}

main();

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^(?:https?:\/\/)(?:(?:www)\.)?([\da-z\.\-]+)\.([a-z\.]{1,6})[\w\-._~:\/?#[\]@!$&'()*+,;=]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(errors());
app.use(handleError);
