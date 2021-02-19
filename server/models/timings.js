export const Time = (sequelize, DataTypes) => {
  const Time = sequelize.define('timings', {
    start: {
      type: DataTypes.DATE,
      allowNull: {
        args: false,
        msg: 'Please enter start time'
      }
    },
    end: {
      type: DataTypes.DATE,
      allowNull: {
        args: false,
        msg: 'Please enter end time'
      }
    },
    carId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'car',
        key: 'id',
        as: 'carId'
      }
    }
  }, {})
  Time.associate = (models) => {
    Time.belongsTo(models.car, {
      foreignKey: 'carId',
      onDelete: 'CASCADE'
    })
  }
  return Time
}
