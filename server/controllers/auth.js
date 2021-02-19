import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token) return res.status(403).send({
    auth: false,
    message: 'No token provided.'
  })
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      let message = 'Failed to authenticate token.'
      if (err.message == 'jwt expired') {
        message = 'Token expired'
      }
      return res.status(500).send({
        auth: false,
        message
      })
    }
    req.userId = decoded.id
    next()
  })
}
