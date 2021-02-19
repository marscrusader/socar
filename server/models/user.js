export const User = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your username'
      },
      unique: {
        args: true,
        msg: 'User already exists'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a password'
      }
    }
  }, {})
  User.associate = (models) => {
    User.hasMany(models.car, {
      foreignKey: 'userId'
    })
  }
  return User
}
