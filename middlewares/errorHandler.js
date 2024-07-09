const errorHandler = (err, req, res, next) => {
  let errorMessage = "";
  console.log(err);

  switch (err.name) {
    case "ErrorNotFound":
      errorMessage = "Error Not Found";
      res.status(404).json({ name: err.name, message: err.message });
      break;

    // Error handling Login and Register
    case "Unauthorized":
      errorMessage = "Unauthorized";
      res.status(401).json({ name: err.name, message: err.message });
      break;
    case "InvalidCredentials":
      errorMessage = "invalid Credentials";
      res.status(401).json({ message: err.message });
      break;
    case "EmailAlreadyExists":
      errorMessage = "Email Already Exists";
      res.status(409).json({ message: err.message });
      break;
    case "jwtExpired":
      errorMessage = "jwtExpired";
      res.status(401).json({ message: err.message });
      break;
    case "TokenExpiredError":
      errorMessage = "Token Expired Error";
      res.status(401).json({ message: err.message });
      break;
    case "JsonWebTokenError":
      errorMessage = "JsonWebTokenError";
      res.status(401).json({ message: err.message });
      break;

    // Default error
    default:
      errorMessage = "Internal Server Error";
      res.status(500).json({ message: err.message });
      break;
  }
};

module.exports = errorHandler;
