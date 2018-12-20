'use strict';
const readData = require('../readFile');
const Model = require('../models')

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return new Promise((resolve, reject) => {
      readData.readData('./school.csv')
      .then((rawData) => {
        let tampung = [];
        rawData.forEach(school => {
          let newSchool = {
            npsn: school[0],
            name: school[1],
            address: school[2],
            email: school[3],
            minGrade: school[4],
            userId: null
          }
          tampung.push(newSchool);
        })
        resolve(Model.School.bulkCreate(tampung, {individualHooks:true}));
      })

      .catch((err) => {
        reject(err);
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Schools', null, {});
  }
};
