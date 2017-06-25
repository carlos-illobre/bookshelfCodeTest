const glob = require('glob')
const router = require('express').Router({mergeParams: true})

module.exports.inject = options => {

  function inject(folder) {
    glob.sync('*/', { cwd: folder })
    .forEach(subfolder => {
      if (glob.sync('index.js', { cwd: folder + subfolder }).length) {
        const path = folder.replace(__dirname, '') + subfolder
        router.use(path, require(`.${path}`))
      }
      inject(folder + subfolder)
    })
  }

  inject(`${__dirname}/`)
  return router
}
