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
          date: moment(faker.date.past()).format('MM/D/YYYY, hh:mm A')
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
      let page = req.query.page || 1, limit = 10
      let profiles = await Profile.list(page, limit)
      let pages = await Profile.pages(limit)

      // for paginator
      page = parseInt(page)
      let showPage = 5, startPage, endPage
      let offset = Math.floor(showPage / 2)
      if (page - offset <= 0) {
        startPage = 1
        endPage = showPage
      } else if (page + offset >= pages) {
        startPage = pages - (showPage - 1)
        endPage = pages
      } else {
        startPage = page - offset
        endPage = page + offset
      }

      res.render('search', {
        profiles: profiles,
        pages: pages,
        limit: limit,
        currentPage: page,
        startPage: startPage,
        endPage: endPage
      })
    } catch (err) {
      res.send('server error')
    }
  })
})

module.exports = router
