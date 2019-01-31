const root = process.cwd()
const router = require('express').Router()

//---> /searches
router.get('/', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      res.render('searches')
    } catch (err) {
      res.send('server error')
    }
  })
})

module.exports = router
