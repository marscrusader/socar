# SOCAR sample task
Since no framework or database was recommended, I used those according to the job description of Socar backend engineer.
## Technology Stack
Framework: **ExpressJS**

Database: **Postgres**

ORM: **Sequelize**

## How to run
1. `npm install`
2. `npm run dev`

## Deployment
Deployed on Heroku, `https://socar-sample-api.herokuapp.com`. Please understand that the first request will take some time to load as I'm on a free Heroku tier.

## Authentication
The requirements from the task is quite vague on this, there is an endpoint to register a user, and another endpoint to login. There is also a "fake" logout api. When the user registers/login, a jwt token is issued to them with a 1 hour expiry duration, the token is required to access other APIs.

## Models
**User**: id, username, password, updatedAt, createdAt

**Car**: id, brand, model, userId (foreignKey), createdAt, updatedAt

**Timings**: id, start, end, available, carId (foreignKey)

A user can have many cars.

A car can only have one user owner.

A car can have many availability times.

A timing can only belong to one car.

**NOTE**: The start and end date/time in this project must be in the format of Javascript's default ISO string 

YYYY-MM-DDTHH:MN:SS.MSSZ, i.e.
```
const dt = new Date()
dt.toISOString()
```

## APIs
**User**
- POST `/api/user/register`, request body:
  - username
  - password

- POST `/api/user/login`, request body:
  - username
  - password
  
- GET `/api/user/logout`, this isn't exactly a proper logout, it just nullifies the token

**Car**
- GET `/api/cars`, request params:
  - start
  - end
  - available

- GET `/api/car/:id`, id is the id of the car

- POST `/api/car/add`, request body:
  - brand
  - model
  
**Timings**
- GET `/api/timings/:carId`

- POST `/api/timing/add`, request body:
  - start
  - end
  - carId
  - available
  
- POST `/api/timing/update`, request body:
  - start
  - end
  - id (this is the id of the timing row)
  - carId
  - available


