const root = process.cwd()
const router = require('express').Router()
const queryString = require('query-string')
const request = require(`${root}/lib/request`)
const settings = require(`${root}/settings`)


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
