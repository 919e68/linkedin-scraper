const path = require('path')
const Nightmare = require('nightmare')
const nightmare = new Nightmare({
  show: true,
  openDevTools: { detach: false }
})
const logger = require('./lib/logger')

let account = {
  username: 'konekred@gmail.com',
  password: '@!redButter071318Ll'
}

let search = {
  keywords: 'Ruby on Rails',
  location: 'Philippines'
}

let currentSearchLocation = ''

let start = async () => {
  logger.info('scraper started')

  await nightmare
    .goto('https://www.linkedin.com')
    .wait('.login-form')
    .insert('#login-email', account.username)
    .insert('#login-password', account.password)
    .click('#login-submit')
    .then(() => {
      logger.info('login successful')
    })
    .catch((err) => {
      logger.error('login failed')
      logger.error(err)
    })

  logger.info(`start getting location id for "${search.location}"`)
  await nightmare
    .wait('#extended-nav-search')
    .goto('https://www.linkedin.com/search/results/people/?origin=DISCOVER_FROM_SEARCH_HOME')
    .inject('js', 'test.js')
    .evaluate((location) => {
      return new Promise((resolve, reject) => {
        fetch(`https://www.linkedin.com/voyager/api/typeahead/hits?types=List(REGION)&q=federated&query=${location}&shouldUseSchoolParams=false`, {
          credentials: 'include',
          headers: {
            'accept': 'application/vnd.linkedin.normalized+json+2.1',
            'csrf-token': getCookie('JSESSIONID'),
            'x-restli-protocol-version': '2.0.0'
          }
        }).then((res) => {
          return res.json()
        }).then(json => {
          if (json.data.elements.length > 0) {
            let locationId = json.data.elements[0].hitInfo.id
            resolve(locationId)
          } else {
            resolve(false)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }, search.location)
    .then((locationId) => {
      currentSearchLocation = locationId
      logger.info(`search result "${locationId}"`)
    })
    .catch(err => {
      logger.error('searching failed')
      logger.error(err)
    })

  logger.info(`start getting members with query location=[${currentSearchLocation}], keyword="${search.keywords}"`)
  let getMembersUrl = `https://www.linkedin.com/search/results/people/?facetGeoRegion=["${currentSearchLocation}"]&keywords=${search.keywords}&origin=GLOBAL_SEARCH_HEADER`
  logger.debug(getMembersUrl)

  await nightmare.goto(encodeURI(getMembersUrl))
  await nightmare.wait('.search-results__list')
  let previousHeight = null
  let currentHeight = 0
  currentHeight = await nightmare.evaluate(() => {
    return document.body.scrollHeight
  })

  for (let i = 0; i < currentHeight; i+=10) {
    await nightmare.scrollTo(i, 0).wait(10)
  }

  await nightmare
    .evaluate(() => {
      let memberUrls = []
      let memberLinkElements = document.querySelectorAll('ul.search-results__list > li.search-result .search-result__info .search-result__result-link')
      for (let i = 0; i < memberLinkElements.length; i++) {
        let memberLinkElement = memberLinkElements[i]
        memberUrls.push(memberLinkElement.href)
      }

      console.log(memberUrls)

      return { memberUrls }
    })
    .then(result => {
      logger.debug(result)
    })
    .catch(err => {
      logger.error('error scraping members')
      logger.error(err)
    })


}

start()