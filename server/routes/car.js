import Cars from '../controllers/car'
import { verifyToken } from '../controllers/auth'

export default (app) => {
  app.get('/api/cars', verifyToken, Cars.list)
  app.get('/api/car/:id', verifyToken, Cars.find)
  app.post('/api/car/add', verifyToken, Cars.create)
}
