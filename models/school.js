'use strict';
module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op
  const School = sequelize.define('School', {
    npsn: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    minGrade: DataTypes.FLOAT,
    userId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (val, opt) => {
        return sequelize.models.User.create({
          username: val.npsn,
          role: 'school'
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

  School.getSchool = (min) => {
    return School.findAll({
      where: {
        minGrade: {
          [Op.lte]: min
        }
      }
    })
  }

  School.associate = function(models) {
    // associations can be defined here
    School.belongsTo(models.User, {foreignKey: 'userId'})
    School.belongsToMany(models.Student, {through: models.Register, foreignKey: 'schoolId'})

  };
  return School;
};