const root = process.cwd()
const db = require(`${root}/database/main`)

class Profile {
  static insertToBeScrape(slug, profileUrl, profileName) {
    return new Promise(async (resolve, reject) => {
      try {
        let res = {
          ok: false,
          message: null,
          errors: []
        }

        if (!slug) {
          res.errors.push({
            type: 'required',
            field: 'slug',
            msg: 'slug is required'
          })
        }

        if (!profileUrl) {
          res.errors.push({
            type: 'required',
            field: 'profileUrl',
            msg: 'profile url is required'
          })
        }

        if (!profileName) {
          res.errors.push({
            type: 'required',
            field: 'profileName',
            msg: 'profile Name is required'
          })
        }

        if (res.errors.length == 0) {
          await db.query(`CALL proc_insert_to_be_scrape(:slug, :profileUrl, :profileName)`, {
            type: db.QueryTypes.RAW,
            replacements: { slug, profileUrl, profileName }
          }).then(() => {
              res.ok = true
          })
        }

        resolve(res)

      } catch (err) {
        reject(err)
      }
    })
  }
}


module.exports = Profile
