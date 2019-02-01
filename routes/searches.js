const root = process.cwd()
const faker = require('faker')
const router = require('express').Router()
const moment = require('moment')
const Profile = require(`${root}/models/Profile`)



router.get('/', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let searches = []
      for (let i = 0; i < 25; i++) {
        searches.push({
          id: 1,
          location: faker.address.country(),
          locationCode: faker.address.countryCode(),
          keywords: `${faker.name.jobDescriptor()} ${faker.name.jobType()}`,
          currentPage: 1,
          scrapeCount: Math.floor(Math.random() * 1000) + 300,
          isFinish: true,
          date: moment(faker.date.past()).format('MM/D/YYYY hh:mm A')
        })
      }

      res.render('searches', {
        searches
      })

    } catch (err) {
      res.send('server error')
    }
  })
})

router.get('/:id', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      const location = faker.address.country()
      const jobType = faker.name.jobType()

      const search = {
        location: location,
        keywords: `${faker.name.jobDescriptor()} ${jobType}`
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
          title: `${faker.name.jobDescriptor()} ${jobType}`,
          location: location
        })
      }

      res.render('searches-view', {
        search,
        profiles
      })

    } catch (err) {
      logger.error(err)
      res.send('server error')
    }
  })
})


module.exports = router
