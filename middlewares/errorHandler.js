const errorHandler = (err, req, res, next) => {
  let errorMessage = "";

  // Handle unique constraint
  if (err.code === "P2002") {
    err.name = "ErrorUniqueConstraint";
  }

  switch (err.name) {
    case "ErrorNotFound":
      errorMessage = "Error Not Found";
      res.status(404).json({ name: err.name, message: errorMessage });
      break;

    // Error handling Login and Register
    case "Unauthorized":
      errorMessage = "Unauthorized";
      res.status(401).json({ name: err.name, message: errorMessage });
      break;
    case "InvalidCredentials":
      errorMessage = "Invalid Credentials";
      res.status(401).json({ message: errorMessage });
      break;
    case "EmailAlreadyExists":
      errorMessage = "Email Already Exists";
      res.status(409).json({ message: errorMessage });
      break;
    case "ErrorUniqueConstraint":
      errorMessage = "Email Already Exists";
      res.status(400).json({ message: errorMessage });
      break;
    case "InvalidPassword":
      console.log("Invalid");
      errorMessage = "Password must be longer than 6 characters";
      return res.status(400).json({ message: errorMessage });
      break;
    case "JwtExpired":
      errorMessage = "JWT Expired";
      res.status(401).json({ message: errorMessage });
      break;
    case "TokenExpiredError":
      errorMessage = "Token Expired Error";
      res.status(401).json({ message: errorMessage });
      break;
    case "JsonWebTokenError":
      errorMessage = "JSON Web Token Error";
      res.status(401).json({ message: errorMessage });
      break;

    // User error
    case "UserNotFound":
      errorMessage = "User Not Found";
      res.status(404).json({ message: errorMessage });
      break;
    case "InvalidUser":
      errorMessage = "You can only access your own data.";
      res.status(401).json({ message: errorMessage });
      break;
    case "InputError":
      errorMessage = "You cant type same value.";
      res.status(401).json({ message: errorMessage });
      break;

    // Address error
    case "AddressError":
      errorMessage = "Address error.";
      res.status(401).json({ message: errorMessage });
      break;

    // Default error
    default:
      errorMessage = "Internal Server Error";
      res.status(500).json({ message: errorMessage });
      break;
  }
};

module.exports = errorHandler;
