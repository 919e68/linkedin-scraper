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