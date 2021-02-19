import Users from '../controllers/user'

export default (app) => {
  app.post('/api/user/register', Users.register)
  app.post('/api/user/login', Users.login)
  app.get('/api/user/logout', Users.logout)
}
