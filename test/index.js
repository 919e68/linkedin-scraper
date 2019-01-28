const root = process.cwd()
const logger = require(`${root}/lib/logger`)
const Scraper = require(`${root}/scraper/profile-links-scraper`)

let account = {
  username: 'konekred@gmail.com',
  password: '@!redButter071318Ll'
}

let scraper = new Scraper()
scraper.login(account.username, account.password).then(() => {
  scraper.searchLocation('Europe').then(locationId => {
    logger.debug(locationId)
  })
})
