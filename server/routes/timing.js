import Timing from '../controllers/timing'
import { verifyCarBelongsToUser } from '../controllers/car'
import { verifyToken } from '../controllers/auth'

export default (app) => {
  app.get('/api/timings/:carId', verifyToken, Timing.list)
  app.post('/api/timing/add', verifyToken, verifyCarBelongsToUser, Timing.create)
  app.post('/api/timing/update', verifyToken, verifyCarBelongsToUser, Timing.update)
}
