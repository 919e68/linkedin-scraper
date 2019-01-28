const Sequelize = require('sequelize')
const settings = require(`../settings`)

let Database = new Sequelize(settings.database.database, settings.database.username, settings.database.password, {
  host: settings.database.host,
  port: settings.database.port,
  database: settings.database.database,
  username: settings.database.username,
  password: settings.database.password,
  dialect: 'mysql',
  logging: false,
  operatorsAliases: false
})

module.exports = Database
