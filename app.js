require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const PORT = process.env.PORT;

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});