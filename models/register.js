'use strict';
module.exports = (sequelize, DataTypes) => {
  const Register = sequelize.define('Register', {
    schoolId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    chooseOrder: DataTypes.INTEGER
  }, {});
  Register.associate = function(models) {
    // associations can be defined here
  };
  return Register;
};