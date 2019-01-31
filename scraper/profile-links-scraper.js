const appPath = process.cwd()
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

class Scraper {
  constructor(locations, keywords, page) {
    this.username = null
    this.password = null
    this.locations = locations
    this.keywords = keywords
    this.currentPage = page || 1
    this.currentUrl = 'https://www.linkedin.com'
  }

  login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        this.currentUrl = 'https://www.linkedin.com'
        this.username = username
        this.password = password

        await nightmare
          .goto('https://www.linkedin.com')
          .wait('.login-form')
          .insert('#login-email', username)
          .insert('#login-password', password)
          .click('#login-submit')
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })

        // await nightmare
        //   .wait('#extended-nav-search')

      } catch (err) {
        reject(err)
      }
    })
  }

  page(pageNum) {
    return new Promise(async (resolve, reject) => {
      try {
        if (pageNum) {
          this.currentPage = pageNum
        }
        pageNum = this.currentPage

        let locationIds = []
        for (let i = 0; i < this.locations.length; i++) {
          await this.searchLocation(this.locations[i]).then(locationId => {
            locationIds.push(locationId)
          })
        }

        let facetGeoRegion = locationIds.map(obj => `"${obj}"`)
        let url = `https://www.linkedin.com/search/results/people/?facetGeoRegion=[${facetGeoRegion}]&keywords=${this.keywords}&origin=GLOBAL_SEARCH_HEADER&page=${this.currentPage}`
        this.currentUrl = url

        await nightmare
          .goto(encodeURI(this.currentUrl))
          .wait('.search-results__list')

        await this.scrollToBottom()

        await nightmare
          .evaluate(() => {
            return new Promise((resolve, reject) => {
              try {
                let members = []
                let isEndOfPage = $('.results-paginator > .page-list > ol > li:last-child').hasClass('active')
                let searchResults = $('ul.search-results__list > li.search-result')

                for (let i = 0; i < searchResults.length; i++) {
                  try {
                    let searchResult = searchResults[i]
                    let profileName = $(searchResult).find('.name.actor-name').html().trim()
                    let profileUrl = $(searchResult).find('.search-result__info .search-result__result-link')[0].href
                    let slug = profileUrl.replace('https://www.linkedin.com/in/', '').replace(/\//g, '')
                    members.push({ slug, profileName, profileUrl })

                  } catch (err) {
                    console.log(err)
                  }
                }
                resolve({ isEndOfPage, members })
              } catch (err) {
                reject(err)
              }
            })
          })
          .then(result => {
            resolve(result)
          })
          .catch(err => {
            reject(err)
          })

      } catch (err) {
        reject(err)
      }
    })
  }

  get(profileUrl) {
    return new Promise(async (resolve, reject) => {
      try {
        await nightmare.goto(profileUrl)
          .inject('js', `${appPath}/lib/evalInject.js`)
          .wait('.core-rail')

        await this.scrollToBottom()

        await nightmare
          .evaluate(async (profileUrl) => {
            let user = {
              url: profileUrl,
              languages: [],
              contactInfo: []
            }

            try {
              let slug = profileUrl.replace('https://www.linkedin.com/in/', '').replace(/\//g, '')
              user.slug = slug

              // user.name = $('.pv-top-card-section__name').html().trim() || ''
              // user.headline = $('.pv-top-card-section__headline').html().trim() || ''
              // user.location = $('.pv-top-card-section__location').html().trim() || ''

              await fetch(`https://www.linkedin.com/voyager/api/identity/profiles/${slug}`, {
                credentials: 'include',
                headers: {
                  'accept': 'application/vnd.linkedin.normalized+json+2.1',
                  'csrf-token': getCookie('JSESSIONID'),
                  'x-restli-protocol-version': '2.0.0'
                }
              })
              .then((res) => res.json())
              .then(json => {
                if ('data' in json) {
                  user.headline = json.data.headline
                  user.summary = json.data.summary
                  user.firstName = json.data.firstName
                  user.lastName = json.data.lastName
                  user.countryCode = json.data.location.basicLocation.countryCode
                  user.postalCode = json.data.location.basicLocation.postalCode
                  user.locationName = json.data.locationName
                }
              })

              sleep = (ms) => {
                return new Promise(resolve => setTimeout(resolve, ms))
              }

              let languageElements = $('.pv-accomplishments-block.languages ul.pv-accomplishments-block__summary-list > li')
              for (let i = 0; i < languageElements.length; i++) {
                let languageEl = languageElements[i]
                let language = $(languageEl).html().trim() || ''
                user.languages.push(language)
              }

              $('.pv-top-card-v2-section__link--contact-info').trigger('click')
              await sleep(1000)
              let contactElements = $('.section-info section.pv-contact-info__contact-type')

              for (let i = 0; i < contactElements.length; i++) {
                let contactElement = contactElements[i]
                let type = $(contactElement).attr('class').replace('pv-contact-info__contact-type', '').trim() || ''
                let title = $(contactElement).find('header').html().trim() || ''
                let value = $(contactElement).find('.pv-contact-info__ci-container .t-black').first().html().replace(/&nbsp;/, '').trim() || ''
                user.contactInfo.push({ type, title, value })
              }

              $('#artdeco-modal-outlet .artdeco-dismiss').click()

            } catch (err) {
              console.error(err)
            }

            return user

          }, profileUrl)
          .then((user) => {
            resolve(user)

          }).catch(err => {
            reject(err)

          })
      } catch (err) {
        reject(err)
      }
    })
  }

  searchLocation(location) {
    return new Promise(async (resolve, reject) => {
      try {
        await nightmare
          .goto('https://www.linkedin.com/search/results/people/?origin=DISCOVER_FROM_SEARCH_HOME')
          .inject('js', `${appPath}/lib/evalInject.js`)
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
          }, location)
          .then(locationId => {
            resolve(locationId)
          })
      } catch(err) {
        reject(err)
      }
    })


  }

  scrollToBottom() {
    return new Promise(async (resolve, reject) => {
      try {
        let previousHeight, currentHeight = 0, lastScrollHeight = 0
        while (previousHeight !== currentHeight) {
          previousHeight = currentHeight
          currentHeight = await nightmare.evaluate(() => {
            return document.body.scrollHeight
          })

          for (let i = 0; i < currentHeight; i++) {
            if (lastScrollHeight < currentHeight) {
              await nightmare.scrollTo(lastScrollHeight + i, 0).wait(1)
              lastScrollHeight += 1
            }
          }

          await nightmare.scrollTo(currentHeight, 0).wait(1000)
        }
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }
}


module.exports = Scraper