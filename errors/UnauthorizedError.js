// Передан неверный логин или пароль. Ещё эту ошибку возвращает авторизационный middleware,
// если передан неверный JWT
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
