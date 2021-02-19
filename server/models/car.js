export const Car = (sequelize, DataTypes) => {
  const Car = sequelize.define('car', {
    brand: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your car brand'
      }
    },
    model: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter your car model'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
        as: 'userId'
      }
    }
  }, {})
  Car.associate = (models) => {
    Car.belongsTo(models.user, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
    Car.hasMany(models.timings, {
      foreignKey: 'carId'
    })
  }
  return Car
}
