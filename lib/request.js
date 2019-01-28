const fetch = require('node-fetch')

let request = {
  get: (url, optConf = {}) => {
    return new Promise((resolve, reject) => {
      let defaultConf = {
        'Content-Type': 'application/json'
      }

      let headers = Object.assign(defaultConf, optConf)

      fetch(url, {
        method: 'GET',
        headers: headers
      }).then(res => {
        resolve(res.json())
      }).catch((err) => {
        reject(err)
      })
    })
  },
  post: (url, data, optConf = {}) => {
    return new Promise((resolve, reject) => {
      let defaultConf = {
        'Content-Type': 'application/json'
      }

      let headers = Object.assign(defaultConf, optConf)
      let isJson = headers['Content-Type'] == 'application/json'
      let body = ''

      if (data && isJson)  {
        body = JSON.stringify(data)
      } else {
        body = data
      }

      fetch(url, {
        method: 'POST',
        body: body,
        headers: headers,
      }).then(res => {
        resolve(res.json())
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = request