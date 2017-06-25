var jwt = require('jsonwebtoken')

module.exports = {
  key: 'woiejflfjsljflsflfeewfwefwllm',
  generate(data) {
    return jwt.sign(data, this.key, { expiresIn: '1h' })
  },
  verify(token) {
    return jwt.verify(token, this.key)
  }
}
