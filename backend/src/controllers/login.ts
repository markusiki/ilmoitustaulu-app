import express from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../utils/config'

const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username: username })
  const passwordCorrect =
    user === null ? false : bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'Invalid username or password'
    })
    return
  }

  const userForToken = {
    id: user._id,
    username: user.username,
    role: user.role
  }

  const token = jwt.sign(userForToken, config.SECRET!)

  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    .status(200)
    .json({ role: user.role, message: 'Logged in succesfully' })
})

export default loginRouter
