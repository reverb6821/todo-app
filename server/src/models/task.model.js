'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    completed: DataTypes.BOOLEAN,
    important: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'task',
  });
  return Task;
};