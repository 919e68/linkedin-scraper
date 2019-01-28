wilson = () => {
  console.log('wilson')
}

sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

simulateClick = (elem) => {
  var evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })

  var canceled = !elem.dispatchEvent(evt)
}

getCookie = (name) => {
  var re = new RegExp(name + "=([^;]+)")
  var value = re.exec(document.cookie)
  return (value != null) ? unescape(value[1]).slice(1, -1) : null
}

// locationSearchHitId = null
// open = window.XMLHttpRequest.prototype.open
// window.XMLHttpRequest.prototype.open = async function (method, url, async, user, pass) {
//   this.addEventListener('readystatechange', async function () {
//     if (url.indexOf('/voyager/api/typeahead/hits') != -1) {
//       if (this.readyState == 4 && this.status == 200) {
//         let convert = await new Response(this.response).text()
//         let response = JSON.parse(convert)

//         if (response.data.elements.length > 0) {
//           locationSearchHitId = response.data.elements[0].hitInfo.id
//           console.log(locationSearchHitId)
//         }
//       }
//     }
//   }, false)
//   open.apply(this, arguments)
// }



// Ember.run(() => {
//   const event = $.Event('keyup')
//   event.which = 13
//   event.keyCode = 13
//   this.$('.type-ahead-input input').value = 'Philippines'
//   this.$('.type-ahead-input input').focus()
//   this.$('.type-ahead-input input').trigger(event)
//   console.log('Hello')
// })

// Ember.run(() => {
//   const event = $.Event('click')
//   this.$('#ember620').trigger(event)
// })

// Ember.run(() => {
//   const event = new KeyboardEvent('keyup', {
//     key: 'Enter',
//   });

//   document.querySelector('.my-input').dispatchEvent(event);
// })

// Ember.run(() => {
//   var evt = new Event('click')
//   document.querySelector('#ember620').dispatchEvent(evt)
// })


// fetch("https://www.linkedin.com/voyager/api/typeahead/hits?types=List(REGION)&q=federated&query=Phil&shouldUseSchoolParams=false", {
//   credentials: 'include',
//   headers: {
//     'accept': 'application/vnd.linkedin.normalized+json+2.1',
//     'csrf-token': getCookie('JSESSIONID'),
//     'x-restli-protocol-version': '2.0.0'
//   }
// }).then((res) => {
//   return res.json()
// }).then(data => {
//   console.log(data)
// })




fetch("https://www.linkedin.com/voyager/api/identity/profiles/rodner-raymundo-a83838a8/profileContactInfo", {
  credentials: 'include',
  headers: {
    'accept': 'application/vnd.linkedin.normalized+json+2.1',
    'csrf-token': getCookie('JSESSIONID'),
    'x-restli-protocol-version': '2.0.0'
  }
}).then((res) => {
  return res.json()
}).then(data => {
  console.log(data)
})


fetch("https://www.linkedin.com/voyager/api/identity/profiles/vrymel", {
  credentials: 'include',
  headers: {
    'accept': 'application/vnd.linkedin.normalized+json+2.1',
    'csrf-token': getCookie('JSESSIONID'),
    'x-restli-protocol-version': '2.0.0'
  }
}).then((res) => {
  return res.json()
}).then(data => {
  console.log(data)
})



