'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  // Create book table
  Book.init({
    // Title row
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "title"',
        },
        notNull: {
          msg: 'Please provide a value for "title"',
        }
      },
    },
    // Author row
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for "author"',
        },
        notNull: {
          msg: 'Please provide a value for "author"',
        }
      },
    },
    // Genre row
    genre: DataTypes.STRING,
    // Year row
    year: DataTypes.INTEGER
    /** Table will also have createdAt and updatedAt rows **/
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};