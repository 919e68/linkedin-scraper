const root = process.cwd()
const router = require('express').Router()
const faker = require('faker')
const queryString = require('query-string')
const logger = require(`${root}/lib/logger`)
const request = require(`${root}/lib/request`)
const settings = require(`${root}/settings`)
const Profile = require(`${root}/models/Profile`)
const lang = require('lang-list').getList()


router.get('/', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let page = req.query.page || 1, limit = 10

      // TODO: remove dummy later
      let profiles = []
      let pages = 982
      for (let i = 0; i < limit; i++) {
        const slug = faker.internet.userName().toLowerCase()
        const profileUrl = `https://www.linkedin.com/${slug}`
        const profileName = faker.name.findName()

        profiles.push({
          slug,
          profileUrl,
          profileName
        })
      }

      // let profiles = await Profile.list(page, limit)
      // let pages = await Profile.pages(limit)

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

      // startPage = startPage > 1 ? startPage : 1
      // endPage = endPage < pages ? pages : endPage

      logger.debug({
        pages: pages,
        startPage: startPage,
        endPage: endPage,
        showPage: showPage
      })

      res.render('main', {
        profiles: profiles,
        pages: pages,
        limit: limit,
        currentPage: page,
        startPage: startPage,
        endPage: endPage
      })
    } catch (err) {
      logger.error(err)
      res.send('server error')
    }
  })
})


router.get('/:slug', (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let firstName = faker.name.firstName()
      let lastName = faker.name.lastName()
      let fullName = `${firstName} ${lastName}`
      let currentTitle = `${faker.name.jobDescriptor()} ${faker.name.jobType()}`
      let location = faker.address.country()
      let username = faker.internet.userName().toLowerCase()
      let linkedIn = `https://www.linkedin.com/in/${username}`
      let email = `${username}@mail.com`
      let phone = faker.phone.phoneNumber()
      let website = faker.internet.domainName()
      let languages = []

      let langCount = Math.floor(Math.random() * 5) + 1
      let randomLangIndex = Math.floor(Math.random() * lang.length)
      for (let i = 0; i < langCount; i++) {
        let language = lang[randomLangIndex]
        languages.push(language)
      }

      languages = languages.join(', ')

      let profile = {
        firstName,
        lastName,
        fullName,
        currentTitle,
        location,
        languages,
        linkedIn,
        email,
        phone,
        website
      }

      let companies = []
      let count = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < count; i++) {
        companies.push({
          name: faker.company.companyName(),
          industry: faker.commerce.department()
        })
      }

      res.render('profile', {
        profile,
        companies
      })
    } catch (err) {
      logger.error(err)
      reject(err)
    }
  })
})


module.exports = router
