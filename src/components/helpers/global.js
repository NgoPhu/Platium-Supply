const eventProps = {
  cart: {
    get: 'cart.get',
    add: 'cart.add',
    update: 'cart.update',
    clear: 'cart.clear',
    count: 'cart.count',
    change: 'cart.change',
    render: 'cart.render'
  },
  product: {
    updateVariant: 'product.update_variant'
  },
  notice: {
    global: 'notice.global'
  },
  wishlist: {
    list: 'wishlist.list',
    change: 'wishlist.change',
    update: 'wishlist.update'
  }
}

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1200

const fetchDataError = (error) => {
  console.log('error', error)
}

const fetchData = (endpoint, callback = null) => {
  return fetch(endpoint)
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json()
      } else {
        callback ? callback() : fetchDataError(response.statusText)
        throw Error(response.statusText)
      }
    })
    .then((jsonResponse) => {
      return jsonResponse
    })
    .catch((error) => {
      callback ? callback(error) : fetchDataError(error)
    })
}

const postData = (endpoint, body, type = 'json', callback = null) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: type === 'json' ? JSON.stringify(body) : body
  })
    .then((response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json()
      } else {
        callback ? callback(response) : fetchDataError(response.statusText)
      }
    })
    .then((jsonResponse) => {
      return jsonResponse
    })
    .catch((error) => {
      fetchDataError(error)
    })
}

const detectBreakpoint = (target = '', width = window.innerWidth) => {
  switch (target) {
    case 'desktop':
      return width >= DESKTOP_BREAKPOINT
    case 'tablet':
      return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
    default:
      return width < TABLET_BREAKPOINT
  }
}

const detectCurrentBreakpoint = () => {
  const width = window.innerWidth
  if (width < MOBILE_BREAKPOINT) {
    return 'mobile'
  } else if (width >= MOBILE_BREAKPOINT && width < DESKTOP_BREAKPOINT) {
    return 'tablet'
  } else if (width > DESKTOP_BREAKPOINT) {
    return 'desktop'
  }
}

export { fetchData, postData, eventProps, detectBreakpoint, detectCurrentBreakpoint }
