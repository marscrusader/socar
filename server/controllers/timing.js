import Model from '../models'
import { hasEmptyFields } from '../utils/checkEmptyFields'
import { isIsoString } from '../utils/checkIsoString'

const { timings } = Model

class Timing {
  static async list(req, res) {
    const carId = req.params.carId
    if (!carId) return res.status(400).send({
      message: 'Invalid car id'
    })
    try {
      const availability = await timings.findAll({
        where: {
          carId
        },
        attributes: ['id', 'start', 'end']
      })
      return res.status(200).send({
        availability
      })
    } catch (listError) {
      console.log(`Failed to list timings for car with id = ${carId}`, listError)
      return res.status(500).send({
        message: 'Failed to list timings for car'
      })
    }
  }

  static async create(req, res) {
    const { start, end, carId } = req.body
    if (hasEmptyFields([start, end, carId])) return res.status(400).send({
      message: 'Start/End time and car id cannot be empty'
    })
    if (![start, end].some(isIsoString)) return res.status(400).send({
      message: 'Invalid datetime format'
    })
    try {
      await timings.create({
        start,
        end,
        carId
      })
      return res.status(201).send({
        message: 'Timing created'
      })
    } catch (createError) {
      console.log('Failed to create timing', createError)
      return res.status(500).send({
        message: 'Failed to add timing for car'
      })
    }
  }

  static async update(req, res) {
    const { start, end, id, carId } = req.body
    if (hasEmptyFields([start, end, id])) return res.status(400).send({
      message: 'Start/End time and car id cannot be empty'
    })
    for (const time of [start, end]) {
      if (!isIsoString(time)) return res.status(400).send({
        message: 'Invalid datetime format'
      })
    }
    try {
      const updated = await timings.update({
        start,
        end
      }, {
        where: {
          id,
          carId
        }
      })
      if (updated[0] === 0) return res.status(404).send({
        message: 'Availability time does not exists'
      })
      return res.status(200).send({
        message: 'Availabily times updated'
      })
    } catch (updateError) {
      console.log('Failed to update timing', createError)
      return res.status(500).send({
        message: 'Failed to update timing for car'
      })
    }
  }
}

export default Timing
