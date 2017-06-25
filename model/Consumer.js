const Bookshelf = require(`${__root_dirname}/getBookshelf.js`)

require('./Quote.js')
require('./Contractor.js')

const Model = Bookshelf.Model.extend({
  tableName: 'consumers',
  hasTimestamps: true,
  quotes() {
    return this.hasMany('Quote')
  },
  contractors() {
    return this.belongsToMany('Contractor').through('Quote')
  },
})

module.exports = Bookshelf.model('Consumer', Model)
