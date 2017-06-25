const quoteStates = require('../enums/quoteStates.js')

exports.up = (knex, Promise) => knex.schema
.createTable('contractors', table => {
  table.increments('id').primary()
  table.string('name').notNullable()
  table.string('email').notNullable()
  table.string('password').notNullable()
  table.timestamps()
})
.createTable('consumers', table => {
  table.increments('id').primary()
  table.string('name').notNullable()
  table.string('email').notNullable()
  table.string('password').notNullable()
  table.timestamps()
})
.createTable('quotes', table => {
  table.increments('id').primary()
  table.string('labour').notNullable()
  table.decimal('expenses').notNullable()
  table.decimal('tax').notNullable()
  table.string('miscellaneous')
  table.enu('state', quoteStates.getValues())
  .notNullable()
  .defaultTo(quoteStates.proposed)
  table.timestamps()
  table.integer('contractor_id')
  .references('contractors.id')
  .notNullable()
  table.integer('consumer_id')
  .references('consumers.id')
  .notNullable()
})

exports.down = (knex, Promise) => knex.schema
.dropTable('quotes')
.dropTable('consumers')
.dropTable('contractors')


