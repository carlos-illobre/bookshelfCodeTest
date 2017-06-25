const Bookshelf = require(`${__root_dirname}/getBookshelf.js`)

require('./Quote.js')
require('./Consumer.js')

const Model = Bookshelf.Model.extend({
  tableName: 'contractors',
  hasTimestamps: true,
  quotes() {
    return this.hasMany('Quote')
  },
  consumers() {
    return this.belongsToMany('Consumer').through('Quote')
  },
})

module.exports = Bookshelf.model('Contractors', Model)
