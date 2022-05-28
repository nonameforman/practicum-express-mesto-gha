const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "6283a52cbb95ef1ad8d43d0f"
  };
  next();
});

app.use(usersRouter);
app.use(cardsRouter);

async function main() {
  await mongoose.connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    useUnifiedTopology: false
  });
  app.listen(PORT, () => {
    console.log(`Порт ${PORT}`);
  });
}

main();