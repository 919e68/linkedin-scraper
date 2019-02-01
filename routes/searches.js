const root = process.cwd()
var faker = require('faker')
const router = require('express').Router()


router.get('/', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      res.render('searches')
    } catch (err) {
      res.send('server error')
    }
  })
})


router.get('/:id', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const search = {
        location: faker.address.country(),
        keywords: `${faker.name.jobDescriptor()} ${faker.name.jobType()}`
      }

      let profiles = []
      for (let i = 0; i < 100; i++) {
        const firstName = faker.name.firstName()
        const lastName = faker.name.lastName()
        const fullName = `${firstName} ${lastName}`

        profiles.push({
          id: i + 1,
          firstName: firstName,
          lastName: lastName, 
          fullName: fullName,
          country: faker.address.country()
        })
      }

      res.render('searches-view', {
        search,
        profiles
      })

    } catch (err) {
      res.send('server error')
    }
  })
})


module.exports = router
