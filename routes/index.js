const root = process.cwd()
const router = require('express').Router()
const queryString = require('query-string')
const logger = require(`${root}/lib/logger`)
const request = require(`${root}/lib/request`)
const settings = require(`${root}/settings`)
const Profile = require(`${root}/models/Profile`)


router.get('/profiles', (req, res) => {
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
      res.send('server error')
    }
  })
})


router.get('/profiles/:slug', (req, res) => {
  return new Promise(async (resolve, reject) => {
    res.render('profile')
  })
})


router.get('/auth', (req, res) => {
  let data = {
    response_type: 'code',
    client_id: settings.linkedIn.appId,
    redirect_uri: 'http://localhost:3000/auth/linkedin/callback',
    state: 'PaEeFxf85A53sdfKEf267',
    scope: 'r_basicprofile'
  }

  let authorizeUrl = 'https://www.linkedin.com/oauth/v2/authorization?' + queryString.stringify(data)
  res.redirect(authorizeUrl)
})


router.get('/auth/linkedin/callback', (req, res) => {
  let ok = false
  let code = ''
  let state = ''

  if (req.query.code && req.query.state) {
    ok = true
    code = req.query.code
    state = req.query.state

    req.session.authCode = code
    req.session.authState = state
  }

  res.json({
    ok: ok,
    authCode: code,
    authState: state
  })
})


router.get('/auth/token', (req, res) => {
  let body = {
    grant_type: 'authorization_code',
    code: req.session.authCode,
    redirect_uri: settings.linkedIn.callbackUri,
    client_id: settings.linkedIn.appId,
    client_secret: settings.linkedIn.appSecret
  }

  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }

  request.post('https://www.linkedin.com/oauth/v2/accessToken', queryString.stringify(body), headers).then(json => {
    req.session.authAccessToken = json.access_token
    req.session.authExpiresIn = json.expires_in

    res.json({
      ok: true,
      data: json
    })
  }).catch(err => {
    res.json({
      ok: false,
      msg: 'Requst Error'
    })
  })
})


router.get('/auth/test', (req, res) => {
  let keywords = ''
  if (req.query.code) {
    keywords = req.query.code
  }

  let headers = {
    'Accept': 'application/json',
    'x-li-format': 'json',
    'withCredentials': true,
    'credentials': 'include',
    'Authorization': 'Bearer '.concat(req.session.authAccessToken),
    'Content-Type': 'application/json'
  }

  request.get(`https://api.linkedin.com/v2/regions`, headers).then(json => {
    console.log(json)
  }).catch(err => {
    console.log('REQUEST ERROR', err)
  })

  res.json({
    ok: true,
    authCode: req.session.authCode,
    authState: req.session.authState,
    authAccessToken: req.session.authAccessToken,
    authExpiresIn: req.session.authExpiresIn
  })
})

module.exports = router
