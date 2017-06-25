module.exports = {

  proposed: 'PROPOSED',
  accepted: 'ACCEPTED',
  rejected: 'REJECTED',
  expired: 'EXPIRED',
  paid: 'PAID',

  getValues() {
    return Object.keys(this)
    .map(key => this[key])
    .filter(value => typeof value != 'function')
  }
}
