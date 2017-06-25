const knex = require('knex')({
  client: 'postgres',
  connection: {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    charset  : 'utf8',
  }
})

module.exports = require('bookshelf')(knex)
.plugin('registry')
