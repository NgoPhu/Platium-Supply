import { getCookie, setCookie } from '@convertdigital/gamma-cookie'

const COOKIE_NAME = 'recently_viewed'
const COOKIE_SKUS_NAME = 'recently_viewed_skus'
const EXPIRE_TIME = 60 * 60 * 24 * 7 // set cookie expire time to 7 days
const MAX_LIMIT = 10

const setRecentlyProducts = (handle) => {
  let recentlyViewed = getRecentlyProducts()
  // Remove current product if it exists
  recentlyViewed = recentlyViewed.filter((i) => i !== handle)
  // Push new product to start of list
  recentlyViewed.unshift(handle)

  const newCookieValue = recentlyViewed.slice(0, MAX_LIMIT).join('|')

  setCookie(COOKIE_NAME, newCookieValue, { expires: EXPIRE_TIME })
}

const getRecentlyProducts = () => {
  const cookieValue = getCookie(COOKIE_NAME) || ''

  return cookieValue.length ? cookieValue.split('|') : []
}

const setRecentlyProductsData = (values) => setCookie(COOKIE_SKUS_NAME, values, { expires: EXPIRE_TIME })

const getRecentlyProductsData = () => {
  const cookieValue = getCookie(COOKIE_SKUS_NAME) || ''

  return cookieValue ? JSON.parse(cookieValue) : []
}

export { setRecentlyProducts, getRecentlyProducts, setRecentlyProductsData, getRecentlyProductsData }
