const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
import config from './utils/config'
const readline = require('readline-sync')
import User from './models/user'

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
    createUser()
  })
  .catch((error) => {
    console.error('error connection to MongoDB', error.message)
  })

const createUser = async () => {
  let username = ''
  while (true) {
    username = readline.question('username: ')
    const usernameExists = await User.exists({ username: username })
    if (!usernameExists) break
    else console.log('Username already in exist!')
  }

  const password = readline.question('password: ', {
    hideEchoBack: true
  })

  const roles = ['admin', 'client']
  const roleIndex = readline.keyInSelect(roles, 'Select role')
  const role = roles[roleIndex]

  const getHash = async () => {
    const saltRounds = 8
    const passwordHash = await bcrypt.hash(password, saltRounds)
    return passwordHash
  }

  const user = new User({
    username: username,
    passwordHash: await getHash(),
    role: role
  })
  try {
    const saved = await user.save()
    if (saved) {
      console.log('User created')
    }
  } catch (error) {
    console.log(error)
  } finally {
    process.exit()
  }
}
