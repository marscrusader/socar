import { Op } from 'sequelize'
import Model from '../models'
import { hasEmptyFields } from '../utils/checkEmptyFields'
import { isIsoString } from '../utils/checkIsoString'

const { car, timings } = Model

export default class Cars {
  static async list(req, res) {
    // remember we set the userId when verifying jwt token
    const { userId } = req
    const { start, end, available } = req.query
    const query = {
      where: {
        userId
      },
      attributes: [
        'id',
        'brand',
        'model'
      ]
    }
    if (start && !end) {
      if (!isIsoString(start)) return res.status(400).send({
        message: 'Invalid datetime format'
      })
      // only get those that are starting from "start"
      query['include'] = [{
        model: timings,
        required: true,
        attributes: [],
        where: {
          start: {
            [Op.gte]: start
          }
        }
      }]
    } else if (!start && end) {
      if (!isIsoString(end)) return res.status(400).send({
        message: 'Invalid datetime format'
      })
      // only get those that are ending on or before "end"
      query['include'] = [{
        model: timings,
        required: true,
        attributes: [],
        where: {
          end: {
            [Op.lte]: end
          }
        }
      }]
    } else if (start && end) {
      for (const time of [start, end]) {
        if (!isIsoString(time)) return res.status(400).send({
          message: 'Invalid datetime format'
        })
      }
      // only get those that are within "start" and "end"
      query['include'] = [{
        model: timings,
        required: true,
        attributes: [],
        where: {
          start: {
            [Op.gte]: start
          },
          end: {
            [Op.lte]: end
          }
        }
      }]
    }
    if (available !== undefined) {
      if (query.hasOwnProperty('include')) {
        query['include'][0]['where']['available'] = available
      } else {
        query['include'] = [{
          model: timings,
          required: true,
          attributes: [],
          where: {
            available
          }
        }]
      }
    }
    try {
      const cars = await car.findAll(query)
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

export const verifyCarBelongsToUser = async (req, res, next) => {
  const { carId } = req.body
  if (!carId) return res.status(400).send({
    message: 'Car id missing'
  })
  const userId = req.userId
  if (!userId) return res.status(400).send({
    message: 'User id is missing'
  })
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
