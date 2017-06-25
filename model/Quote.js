const Bookshelf = require(`${__root_dirname}/getBookshelf.js`)

require('./Consumer.js')
require('./Contractor.js')

const Model = Bookshelf.Model.extend({
  tableName: 'quotes',
  hasTimestamps: true,
  customers() {
    return this.belongsTo('Customer')
  },
  contractors() {
    return this.belongsTo('Contractor')
  },
})

module.exports = Bookshelf.model('Quote', Model)
