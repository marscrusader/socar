import Model from '../models'
import { hasEmptyFields } from '../utils/checkEmptyFields'

const { car } = Model

class Cars {
  static async list(req, res) {
    // remember we set the userId when verifying jwt token
    const { userId } = req
    try {
      const cars = await car.findAll({
        where: {
          userId
        },
        attributes: [
          'id',
          'brand',
          'model'
        ]
      })
      return res.status(200).send({
        cars
      })
    } catch (carError) {
      console.log('Failed to list cars', carError)
      return res.status(500).send({
        message: 'Failed to retrieve cars for user'
      })
    }
  }

  static async find(req, res) {
    const { userId } = req
    const id = req.params.id
    try {
      const result = await car.findOne({
        where: {
          id,
          userId
        },
        attributes: [
          'id',
          'brand',
          'model'
        ]
      })
      if (!result) return res.status(404).send({
        message: 'car not found'
      })
      return res.status(200).send({
        car: result
      })
    } catch (findError) {
      console.log('Failed to find car belonging to user', findError)
      return res.status(500).send({
        message: 'Failed to retrieve car for user'
      })
    }
  }

  static async create(req, res) {
    const { brand, model } = req.body
    if (hasEmptyFields([brand, model])) return res.status(400).send({
      message: 'Brand or model is missing'
    })
    const { userId } = req
    try {
      await car.create({
        brand,
        model,
        userId
      })
      return res.status(201).send({
        message: 'Car created'
      })
    } catch (createError) {
      console.log(`Failed to create car for user with id=${userId}`, createError)
      return res.status(500).send({
        message: 'Failed to add car for user'
      })
    }
  }
}

export default Cars

export const verifyCarBelongsToUser = async (req, res, next) => {
  const { carId } = req.body
  if (!carId) return res.status(400).send({
    message: 'Car id missing'
  })
  const userId = req.userId
  try {
    const resp = await car.findOne({
      where: {
        id: carId
      },
      attributes: ['userId']
    })
    if (!(resp.userId === userId)) return res.status(401).send({
      message: 'Car does not belong to user'
    })
    return next()
  } catch (error) {
    console.log('Failed to verify if car belongs to user', error)
    return res.status(500).send({
      message: 'Failed to verify if car belongs to user'
    })
  }
}
