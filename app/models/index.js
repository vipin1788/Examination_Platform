const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const config = require('./../config/appConfig');

const db = {};

let sequelize;
if (config.database.DATABASE_URL) {
  sequelize = new Sequelize(config.database.DATABASE_URL);
} else {
  sequelize = new Sequelize(config.database.dbname, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: config.database.dialect,
    operatorsAliases: false,
    dialectOptions: {
      options: {
        encrypt: true,
        requestTimeout: 3000000, // timeout = 30 seconds
        freezeTableName: true,
        enableArithAbort: true,
        validateBulkLoadParameters: true,
        multipleStatements: true,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

// sequelize
//     .authenticate()
//     .then(() => {
//       console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//       console.error('Unable to connect to the database:', err);
//     });

// fs
//   .readdirSync(__dirname)
//   .filter(file =>
//     (file.indexOf('.') !== 0) &&
//     (file !== basename) &&
//     (file.slice(-3) === '.js'))
//   .forEach((file) => {
//     // const model = sequelize['import'](path.join(__dirname, file));
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
//     db[model.name] = model;
//   });
//
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.State = require("./state.js")(sequelize, Sequelize);
db.City = require("./city.js")(sequelize, Sequelize);
db.UserType = require("./userType.js")(sequelize, Sequelize);
db.UserAccount = require("./userAccount.js")(sequelize, Sequelize);

module.exports = db;
