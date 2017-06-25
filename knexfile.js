const env = require('properties-reader')('.env')

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      user     : process.env.DB_USER || env.path().DB_USER,
      password : process.env.DB_PASSWORD || env.path().DB_PASSWORD,
      database : process.env.DB_NAME || env.path().DB_NAME,
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

}
