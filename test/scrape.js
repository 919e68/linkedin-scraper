const root = process.cwd()
const logger = require(`${root}/lib/logger`)
const Scraper = require(`${root}/scraper/profile-links-scraper`)
const Profile = require(`${root}/models/Profile`)

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let account = {
  username: 'konekred@gmail.com',
  password: '@!redButter071318Ll'
}

let runScraper = (locations, keywords) => {
  return new Promise(async (resolve, reject) => {
    try {
      let scraper = new Scraper(locations, keywords)
      let loginSuccessful = false
      await scraper
        .login(account.username, account.password)
        .then(success => {
          if (success = true) {
            loginSuccessful = true
          }
        })

      if (!loginSuccessful) {
        logger.error('login failed.')
        reject('login failed')
      }

      logger.info('login sucessful.')
      sleep(5000)

      await scraper.nightmare
        .evaluate(() => {
          let body = document.querySelector('body')
          return body.innerHTML
        })
        .then(data => {
          console.log(data)
        })

    } catch (err) {
      reject(err)
    }
  })
}

runScraper(['Philippines', 'Canada'], 'Ruby on Rails')
  .then(() => {
    nightmare.end()
    logger.info(`done scraping links!`)
  })
  .catch(err => {
    logger.error('runScraper error!')
    logger.error(err)
  })


