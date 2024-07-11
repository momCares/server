require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const router = require("./routes");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const PORT = process.env.PORT;
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const addressRoute = require("./routes/addressRoute")

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Router
app.use("/v1/api/auth", authRoute);
app.use("/v1/api/users", userRoute);
app.use("/v1/api/address", addressRoute)

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
