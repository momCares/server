const authService = require('../services/authService')

//Register dan Login
const register = async (req, res, next) => {

    try {
        const user = await authService.register(req.body)
        res.status(201).json({message: "User Registered", data: user})
    } catch (err) {
        next(err)
    }

}

const login = async (req, res, next) => {
    try {
      const { user, token } = await authService.login(req.body);
      res.json({ user, token });
    } catch (error) {
        next(err)
    }
  }

module.exports = { register, login }
