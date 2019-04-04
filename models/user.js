const {generatePassword, updatePassword} = require('../helpers/generatePassword')
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    secret: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (values) => {
        let password = generatePassword()
        values.password = password.hash
        values.secret = password.secret
      },
      beforeUpdate: (values) => {
        let password = updatePassword(values.password)
        values.password = password.hash
        values.secret = password.secret
      }
    }
  });

  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.School, {foreignKey: 'userId'})
    User.hasOne(models.Student, {foreignKey: 'userId'})
  };
  return User;
};