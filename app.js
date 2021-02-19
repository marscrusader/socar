import http from 'http'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import userRoutes from './server/routes/user'
import carRoutes from './server/routes/car'

const port = 3000
const app = express() // setup express application
const server = http.createServer(app)

app.use(logger('dev')) // log requests to the console

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
userRoutes(app)
carRoutes(app)

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the default API route',
}))

server.listen(port, () => {
  console.log(`Server running at port ${port}`)
})