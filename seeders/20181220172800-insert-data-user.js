'use strict';
const readData = require('../readFile');

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
      readData.readData('./student.csv')
      .then((rawData) => {
        let tampung = [];
        rawData.forEach(student => {
          let newStudent = {
            nisn: student[0],
            name: student[1],
            placeOfBirth: student[2],
            dateOfBirth: student[3],
            address: student[4],
            indonesian: student[5],
            mathematics: student[6],
            english: student[7],
            sains: student[8],
          }
          tampung.push(newStudent);
        })
        resolve(queryInterface.bulkInsert('Students', tampung, {}));
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
    return queryInterface.bulkDelete('Students', null, {});
  }
};
