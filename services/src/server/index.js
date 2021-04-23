import express from "express";
// import expressValidation from "express-validation";
import helmet from "helmet";
import logger from "morgan";

import userRoutes from "./../modules/user/user.routes";

var env = process.env.NODE_ENV || "development";
var config = require("./config")[env];

const app = express();

/** Must be both for use and options !!! otherwise this won't work with react !!! */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  next();
});

app.options("/*", function (req, res, next) {
  // No 'Access-Control-Allow-Origin' header is present on the requested resource
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, Content-Length, X-Requested-With"
  );
  res.sendStatus(200);
});

app.enable("etag"); // use strong etags

var morgan = require("morgan");
app.use(logger("dev")); // Log all requests to console

// SECURITY !!!
// Adds some security https://github.com/helmetjs/helmet app.use(helmet())
app.use(helmet());

var cookieParser = require("cookie-parser");
app.use(cookieParser()); // Read cookies for auth

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mount all routes on /api path
app.use("/users", userRoutes);

// app.use((err, req, res, next) => {
//   if (err instanceof
//     expressValidation.ValidationError) {
//       res
//         .status(err.status).json(err);
//   } else {
//     res
//       .status(500).json({
//         status: err.status, message:
//           err.message
//       });
//   }
// });

app.listen(config.server.port, config.server.host);
console.log(
  `WEB: ${config.server.host}:${config.server.port}, DB: ${config.database.name}`
);

// export default app;
module.exports = app;
