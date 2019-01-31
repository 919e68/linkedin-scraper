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

      let startPage = 1
      let isEndOfPage = false
      for (let page = startPage; !isEndOfPage; page++) {
        logger.info(`scraping page ${page}...`)
        sleep(3000)
        await scraper
          .page(page)
          .then((result) => {
            return new Promise(async (resolve, reject) => {
              try {
                logger.info(`results from ${scraper.currentUrl}`)

                let members = result.members
                isEndOfPage = result.isEndOfPage

                // let successInserts = 0
                // for (let i = 0; i < members.length; i++) {
                //   let member = members[i]
                //   await Profile.insertToBeScrape(member.slug, member.profileUrl, member.profileName).then(() => {
                //     successInserts += 1
                //     logger.debug(JSON.stringify(member, null, 2))
                //   })
                // }

                // logger.info(`${successInserts} data has been scraped.`)
                // resolve(true)

                logger.debug(members)
                resolve(true)

              } catch (err) {
                reject(err)
              }
            })
          })
          .catch(err => {
            logger.error(err)
          })
      }

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


