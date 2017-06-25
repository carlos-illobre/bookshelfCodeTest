module.exports = require('express').Router({mergeParams: true})
.get('/', (req, res) => {
    res.redirect(`${req.originalUrl}/v1`)
})
