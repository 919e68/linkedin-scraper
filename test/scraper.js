const appPath = process.cwd()
const logger = require(`${appPath}/lib/logger`)
const settings = require(`${appPath}/settings`)
const Nightmare = require('nightmare')

let showNightmare = settings.showNightmare
if (process.env.APP_ENV == 'production') {
  showNightmare = false
}

const nightmare = new Nightmare({
  show: showNightmare,
  openDevTools: false
})


nightmare
  .goto('http://example.com')
  .wait('h1')
  .evaluate(() => {
    let header = document.querySelector('h1')
    return header.innerHTML
  })
  .then(data => {
    logger.debug(data)
  })
  .catch(err => {
    logger.error(err)
  })