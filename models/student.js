'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    nisn: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    placeOfBirth: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    address: DataTypes.STRING,
    indonesian: DataTypes.FLOAT,
    mathematics: DataTypes.FLOAT,
    english: DataTypes.FLOAT,
    sains: DataTypes.FLOAT,
    userId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (val, opt) => {
        return sequelize.models.User.create({
          username: val.nisn,
          role: 'student'
        })

        .then((user) => {
          val.userId = user.dataValues.id
        })
      },
      beforeUpdate: (val, opt) => {
        return sequelize.models.User.create({
          username: val.nisn,
          role: 'student'
        })

        .then((user) => {
          val.userId = user.dataValues.id
        })
      },
      beforeDestroy: (val) => {
        return sequelize.models.User.destroy({
          where: {
            id: val.userId
          }
        })
      }
    }
  });

  Student.prototype.getAverage = function(){
    return (this.indonesian + this.mathematics + this.english + this.sains) / 4;
  }

  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsTo(models.User, {foreignKey: 'userId'})
    Student.belongsToMany(models.School, {through: models.Register, foreignKey: 'studentId'})
  };
  return Student;
};