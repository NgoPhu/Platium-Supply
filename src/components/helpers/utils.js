import { formatMoney } from 'uses/useShopify'

/**
 * Function that always returns True
*/
const returnTrue = () => true

/**
* Function that always returns false
*/
const returnFalse = () => false

/**
* Identity function
* @param {*} val
* @return {*}
*/
const identity = (val) => val

const not = (val) => !val

/**
* Returns a curried function of the provided function, so that:
*
* f(a, b, c) = f(a, b)(c) = f(a)(b)(c) = f(a)(b, c)
*
* @param {Function} f
* @param {..*} Initial parameters
* @return {Function} The curried function
*/
const curry = (f, ...args) => args.length >= f.length ? f(...args) : curry.bind(this, f, ...args)

const allPass = (fs) => (...args) => {
  for (let i = 0; i < fs.length; i++) {
    if (!fs[i].apply(this, args)) {
      return false
    }
  }
  return true
}

/**
* Takes in a list of predicates and return a function that will
* pass its arguments through each of the predicates, returning
* true if any predicate is satisfied.
*
* @param {Array<Function>}
* @return {Function}
*/
const anyPass = (fs) => (...args) => {
  for (let i = 0; i < fs.length; i++) {
    if (fs[i].apply(this, args)) {
      return true
    }
  }

  return false
}

/**
* Encapsulates switch/case or if/else logic.
*
* Takes a list of [predicate, transformer] pairs.
*
* The returned function passes its arguments to predicates, evaluates them, and execute the matched transformer (passing the
* same arguments). If there's no matched predicate, return undefined.
*
* @param pairs Pairs of [predicate, transformer]
* @return {Function} Encapsulated function
*/
const cond = (pairs) => (...args) => {
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i][0].apply(this, args)) {
      return pairs[i][1].apply(this, args)
    }
  }

  return undefined
}

/**
* Encapsulate if/else logic. Basically a wrapper of `cond`.
*
* @param p Predicate
* @param {Function} fT Function to call when predicate is true
* @param {Function} fF Function to call when predicate is false
* @return {Function} Encapsulated function
*/
const ifElse = (p, fT, fF) => cond([[p, fT], [returnTrue, fF]])

const when = (p, f) => cond([[p, f], [returnTrue, identity]])

/**
* Functional wrapper for array map function.
*
* @param {Function} f
* @param {*} arr
*/
const map = curry((f, arr) => Array.isArray(arr) ? arr.map(f) : f(arr))

const filter = curry((f, arr) => Array.isArray(arr) ? arr.filter(f) : (f(arr) ? arr : undefined))

/**
* Partial application
* @param {Function} f
* @param {..*} args Initial parameters
*/
const partial = (f, ...args) => f.bind(this, ...args)

/**
* Transform a value by chaining a list of function from left to right
*
* @param val
* @param {..Function} funcs
* @return {*}
*/
const pipe = (...funcs) => function (val) { return funcs.reduce((acc, f) => f.apply(this, [acc]), val) }

const always = (val) => partial(val)

/**
* Get property of an object.
*
* This is a curried function.
*
* @param {string} prop
* @param {Object} obj
* @return {*}
*/
const getProp = curry((prop, obj) => {
  return obj[prop]
})

const lt = curry((b, a) => a < b)

const setProp = curry((prop, value, obj) => {
  obj[prop] = value
  return obj
})

/**
* Delay execution of callback used on individual items of a list.
*
* This function is curried.
*
* @param {number} initial Initial timeout
* @param {number} step Delay per execution
* @param {Function} callback Callback
* @param {Array} items
* @private
*/
const _staggerCallback = (initial, step, callback, items) => (
  items.reduce((delay, item) => {
    setTimeout(() => callback(item), delay)
    return delay + step
  }, initial)
)

/**
* Delay execution of callback used on individual items of a list.
*
* This function is curried.
*
* @param {number} initial Initial timeout
* @param {number} step Delay per execution
* @param {Function} callback Callback
* @param {Array} items
*/
const staggerCallback = curry(_staggerCallback)

/**
* Encapsulate try/catch logic.
*
* Takes a pair of tryer and catcher functions. User must ensure tryer and catcher return the same
* type so that chaining / composing works.
*
* Returns a function that can take arguments, which will be passed to both tryer and catcher.
*
* @param {Function} tryer
* @param {Function} catcher
* @return {Function} Encapsulated function
*/
const tryCatch = (tryer, catcher) => (...args) => {
  try {
    return tryer(...args)
  } catch (e) {
    return catcher(e, ...args)
  }
}

const whileDo = (pred, fn, initial) => pred(initial) ? whileDo(pred, fn, fn(initial)) : initial

const divide = curry((b, a) => a / b)
const multiply = curry((b, a) => a * b)

/**
* Check if an array contains an item.
*
* This is a curried wrapper for Array.prototype.indexOf
*
* @param {Array}
* @param {*}
* @return {boolean}
*/
const inArray = curry((array, item) => array.indexOf(item) !== -1)

/**
* Get the nth element of an array
*
* @param {number}
* @param {Array}
* @return {*}
*/
const nth = curry((index, array) => index < 0 ? array[array.length + index] : array[index])

/**
* Get the nth element of an array
*
* @param {Array}
* @return {*}
*/
const first = nth(1)

const last = nth(-1)
const add = curry((b, a) => a + b)
const _add1ToLast = pipe(last, add(1))

const range = (from, to) => whileDo(
  pipe(_add1ToLast, lt(to)),
  (array) => [...array, _add1ToLast(array)],
  [from]
)

const flipArgs = (f) => curry((arg1, arg2) => f.apply(this, [arg2, arg1]))

const count = (arr) => arr.length

/**
* Create an array out of an array-like object
*
* @param {Object} Array-like object
* @return {Array} Array
*/
const makeArray = (arrayLike) => Array.prototype.slice.call(arrayLike)

/**
* Log a value to console
*
* @param {*} val
* @returns {*}
*/
const log = (val) => {
  return val
}

const logWrap = (fn) => (...args) => log(fn.apply(this, args))

const logArgs = (fn) => (...args) => {
  log(args)
  return fn.apply(this, args)
}

const then = curry((f, promise) => promise.then(f))
const reject = curry((f, promise) => promise.catch(f))

const parseOptions = (string, def = {}) => {
  let options = {}
  try {
    options = JSON.parse(string)
  } catch (e) {
    console.warn('Invalid option JSON string.')
    console.trace()

    return def
  }

  return Object.assign({}, def, options)
}

const _getQueryPattern = (key) => new RegExp(`[?&]${key}=([^&]+)`)

const getQueryVar = (key, url = window.location.href) => {
  const pattern = _getQueryPattern(key)
  const matches = url.match(pattern)
  return matches ? matches[1] : ''
}

/**
* Parse a query string into an object with { key: value } structure
*
* @param {string} url
* @returns {Object}
*/
const getQueryVars = (url = window.location.href) =>
  url.replace(/^\?/, '') // remove ? prefix
    .split('&') // split into `key=value` chunks
    .filter(Boolean) // remove empty string
    .reduce(
      /**
      * Aggregate key=value chunks into an Object with {key: value} structure
      * @param {Object} queryVars - aggregated object
      * @param {string} pair - e.g. 'key=value'
      * @returns {Object} - e.g. {key: value}
      */
      (queryVars, pair) => {
        const [key, value] = pair.split('=')
        queryVars[key] = value
        return queryVars
      },
      {}
    )

const addQueryVar = (key, value, url = window.location.href) => {
  const removed = removeQueryVar(key, url)
  if (!value && value !== 0) {
    return removed
  }
  return `${removed}${removed.indexOf('?') === -1 ? '?' : '&'}${key}=${value}`
}

const addQueryVars = (object, url = window.location.href) =>
  Object.keys(object).reduce((agg, key) => {
    return addQueryVar(key, object[key], agg)
  }, url)

const removeAllQueryVars = (url = window.location.href) => url.replace(/\?.+$/g, '')

const removeQueryVar = (key, url = window.location.href) => {
  const idx = url.indexOf('?')

  if (idx === -1) {
    return url
  }

  const pattern = _getQueryPattern(key)
  const replaced = url.replace(pattern, '').replace(/\?$/, '')

  if (replaced.indexOf('&') !== -1 && replaced.indexOf('?') === -1) {
    return replaced.replace(/&/, '?')
  }

  return replaced
}

const toPascalCase = name => name.charAt(0).toUpperCase() + name.slice(1).replace(/(-\w)/g, m => m[1].toUpperCase())

const isLocationEqual = (location1, location2) => {
  const pathname1 = location1.pathname ? location1.pathname.replace(/^\//, '') : ''
  const pathname2 = location2.pathname ? location2.pathname.replace(/^\//, '') : ''

  return (!location1.protocol || !location2.protocol || location1.protocol === location2.protocol) &&
    (!location1.host || !location2.host || location1.host === location2.host) &&
    (!pathname1 || pathname2 || pathname1 === pathname2)
}

const isNaiveEqual = (obj1, obj2) => {
  const objKeys1 = Object.keys(obj1)
  const objKeys2 = Object.keys(obj2)

  if (objKeys1.length !== objKeys2.length) {
    return false
  }

  for (const key in obj1) {
    if (!obj2[key] || obj2[key] !== obj1[key]) {
      return false
    }
  }

  return true
}

const isIEorEdge = () => {
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}

const set = (item, selector) => {
  if (item instanceof Array) {
    for (const i of item) {
      i.classList.add(selector)
    }
  } else {
    item.classList.add(selector)
  }
}

const unset = (item, selector) => {
  if (item instanceof Array) {
    for (const i of item) {
      i.classList.remove(selector)
    }
  } else {
    item.classList.remove(selector)
  }
}

const isTouch = () => 'ontouchstart' in document.documentElement

/**
 * Storefront API IDs Generator
 * @param {string} type Object type
 * @param {string} databaseKey Object ID
 * @returns {string} GraphQL ID
 */

const hasOwnProperties = (property, obj) => {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

const scrollOver = (el, callback) => {
  if (typeof callback !== 'undefined') {
    (window.scrollY > (el.offsetHeight + el.offsetTop)) && callback()
  }
}

const chunkArray = (arr, size) => arr.reduce((acc, e, i) => {
  if (i % size) {
    acc[acc.length - 1].push(e)
  } else {
    acc.push([e])
  }
  return acc
}, [])

const inViewPort = (el, callback) => {
  const rect = el.getBoundingClientRect();
  (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  ) && typeof callback === 'function' && callback()
}

const initInstance = (callback, ctx = this) => {
  const isDesignMode = window.Shopify.designMode || false

  return (...args) => {
    callback.apply(ctx, args) // Init instance
    isDesignMode && document.addEventListener('shopify:section:load', () => callback.apply(ctx, args))
  }
}

const isPage = (page) => {
  if (window.location.pathname.indexOf(`/${page}/`) !== -1) {
    return true
  }
  return false
}

const getDefaultImage = (img) => {
  return (Array.isArray(img) && img.length === 0) || !img ? window.GM_STATE.shopify.defaultImage : img
}

const isEmpty = val => val == null || !(Object.keys(val) || val).length

const formatName = (string) => string && typeof string === 'string' && string.includes('-') ? string.split('-')[1] : string

const formatRangePrice = (values) => values && values.map(item => formatMoney(item * 100)).join(' - ')

const getArrayFromString = (str) => str ? JSON.parse(str.replace(/&quot;/g, '"')) : []

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export {
  add,
  addQueryVar,
  addQueryVars,
  allPass,
  always,
  anyPass,
  cond,
  count,
  log,
  logArgs,
  logWrap,
  makeArray,
  curry,
  divide,
  filter,
  first,
  flipArgs,
  getProp,
  getQueryVar,
  getQueryVars,
  identity,
  ifElse,
  inArray,
  toPascalCase,
  isLocationEqual,
  parseOptions,
  last,
  lt,
  map,
  multiply,
  not,
  nth,
  partial,
  pipe,
  range,
  returnTrue,
  returnFalse,
  setProp,
  staggerCallback,
  then,
  removeQueryVar,
  removeAllQueryVars,
  reject,
  tryCatch,
  when,
  whileDo,
  isNaiveEqual,
  isIEorEdge,
  set,
  unset,
  isTouch,
  hasOwnProperties,
  scrollOver,
  inViewPort,
  initInstance,
  isPage,
  chunkArray,
  getDefaultImage,
  isEmpty,
  formatName,
  formatRangePrice,
  getArrayFromString,
  delay
}
