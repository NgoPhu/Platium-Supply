import { v4 as uuidv4 } from 'uuid'
const { searchSpringConfig } = window.GM_STATE.integrations

const intellisuggestTrackClick = (elementHref, data, signature) => {
  const escapeFn = encodeURIComponent || escape
  let apiUrl = ''

  if (document.images) {
    if (location.protocol === 'https:') {
      apiUrl = `https://${searchSpringConfig.siteId}.a.searchspring.io/api/`
    } else {
      apiUrl = `http://${searchSpringConfig.siteId}.a.searchspring.io/api/`
    }

    const imgTag = new Image()
    imgTag.src = apiUrl + 'track/track.json?d=' + data + '&s=' + signature + '&u=' + escapeFn(elementHref) + '&r=' + escapeFn(document.referrer)
  }

  return true
}

const postBeaconTracking = (data) => {
  const config = {
    method: 'POST',
    redirect: 'follow',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }
  }
  return fetch('https://beacon.searchspring.io/beacon', config).then((result) => result)
}

const beaconProfileProduct = (product, skus, tag, type) => {
  const data = [
    {
      type,
      category: 'searchspring.recommendations.user-interactions',
      id: uuidv4(),
      pid: uuidv4(),
      event: {
        product: {
          id: product.id,
          seed: skus,
          mappings: product.mappings
        },
        context: {
          type: 'product-recommendation',
          tag,
          placement: tag
        }
      },
      context: {
        website: {
          trackingCode: searchSpringConfig.siteId
        },
        userId: uuidv4(),
        sessionId: uuidv4(),
        pageLoadId: uuidv4()
      }
    }
  ]
  return data
}

const generateBeaconProduct = (product, skus, tag, type) => {
  const data = {
    type,
    category: 'searchspring.recommendations.user-interactions',
    id: uuidv4(),
    pid: uuidv4(),
    event: {
      product: {
        id: product.id,
        seed: skus,
        mappings: product.mappings
      },
      context: {
        type: 'product-recommendation',
        tag,
        placement: tag
      }
    },
    context: {
      website: {
        trackingCode: searchSpringConfig.siteId
      },
      userId: uuidv4(),
      sessionId: uuidv4(),
      pageLoadId: uuidv4()
    }
  }
  return data
}

const generateBeaconProducts = (products, skus, tag, type) => {
  return products.map((product) => generateBeaconProduct(product, skus, tag, type))
}

const generateBeacon = (skus, tag, type) => {
  const data = [
    {
      type,
      category: 'searchspring.recommendations.user-interactions',
      id: uuidv4(),
      pid: null,
      event: {
        profile: {
          tag,
          placement: tag,
          seed: skus
        },
        context: {
          type: 'product-recommendation',
          tag,
          placement: tag
        }
      },
      context: {
        website: {
          trackingCode: searchSpringConfig.siteId
        },
        userId: uuidv4(),
        sessionId: uuidv4(),
        pageLoadId: uuidv4()
      }
    }
  ]
  return data
}

const initBasketTracking = (cart) => {
  if (cart && cart.items.length) {
    setTimeout(function () {
      window.SLS.asyncLoad([
        {
          url: '//cdn.searchspring.net/intellisuggest/is.min.js',
          callback: function () {
            if (IntelliSuggest) {
              try {
                const seed = []
                for (const item of cart.items) {
                  if (!item.sku) {
                    continue
                  }
                  seed.push(item.sku)
                  IntelliSuggest.haveItem({
                    sku: item.sku,
                    qty: item.quantity,
                    price: item.price
                  })
                }
                IntelliSuggest.init({
                  siteId: searchSpringConfig.siteId,
                  context: 'Basket',
                  seed
                })
                IntelliSuggest.inBasket({})
              } catch (err) {
                console.error('Intellisuggest error, cart snippet', err)
              }
            }
          }
        }
      ])
    }, 500)
  }
}

export { intellisuggestTrackClick, postBeaconTracking, beaconProfileProduct, generateBeacon, generateBeaconProducts, initBasketTracking }
