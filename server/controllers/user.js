import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Model from '../models'
import { hasEmptyFields } from '../utils/checkEmptyFields'

const { user } = Model
const secretKey = process.env.SECRET

class Users {
  static async register(req, res) {
    const { username, password } = req.body
    if (hasEmptyFields([username, password])) return res.status(400).send({
      auth: false,
      message: 'Username or password cannot be empty'
    })
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 8)
    } catch (hashError) {
      console.log('Failed to hash password', hashError)
      return res.status(500).send({
        message: 'Failed to hash password'
      })
    }
    try {
      const newUser = await user.create({
        username,
        password: hashedPassword
      })
      const token = jwt.sign({ id: newUser.id }, secretKey, {
        expiresIn: 3600 // expires in 1 hour
      })
      return res.status(201).send({
        message: 'User created',
        auth: true,
        token
      })
    } catch (userError) {
      console.log('Failed to create user', userError)
      return res.status(500).send({
        message: 'Failed to create user'
      })
    }
  }

  static async login(req, res) {
    const { username, password } = req.body
    if (hasEmptyFields([username, password])) return res.status(400).send({
      auth: false,
      message: 'Username or password cannot be empty'
    })
    let passwordHash
    let userId
    try {
      const foundUser = await user.findOne({
        where: {
          username
        }
      })
      if (!foundUser) return res.status(500).send({
        auth: false,
        message: 'User does not exist'
      })
      passwordHash = foundUser.password
      userId = foundUser.id
    } catch (loginError) {
      console.log('Failed to login', loginError)
      return res.status(500).send({
        auth: false,
        message: 'Failed to login'
      })
    }
    try {
      const isPasswordValid = await bcrypt.compare(password, passwordHash)
      if (!isPasswordValid) return res.status(401).send({
        auth: false,
        token: null,
        message: 'Invalid password'
      })
      const token = jwt.sign({ id: userId }, secretKey, {
        expiresIn: 3600
      })
      return res.status(200).send({
        auth: true,
        token
      })
    } catch (passwordError) {
      return res.status(500).send({
        auth: false,
        token: null,
        message: 'Error checking password'
      })
    }
  }

  static logout(req, res) {
    // Very simple logout, refer to readme on why
    return res.status(200).send({
      auth: false,
      token: null
    })
  }
}

export default Users
