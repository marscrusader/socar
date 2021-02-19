import Model from '../models'

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
      if (!result) return res.status(200).send({
        message: 'car not found'
      })
      return res.status(200).send({
        result
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
