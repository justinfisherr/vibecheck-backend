require("dotenv").config();
const express = require("express");
const app = express();
const databaseConnect = require("./database");
const cors = require("cors");
const cookieParser = require("cookie-parser");

databaseConnect();

const authRouter = require("./routes/auth");
const compareRouter = require("./routes/compare");
const usersRouter = require("./routes/getUsers");
const changeID = require("./routes/changeID");
const deleteUser = require("./routes/deleteUser");
app
  .use(express.json())
  .use(cors())
  .use(cookieParser())
  .use(authRouter)
  .use(compareRouter)
  .use(usersRouter)
  .use(changeID)
  .use(deleteUser);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
