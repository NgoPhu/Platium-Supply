/* global Promise, getComputedStyle, CustomEvent */
import { makeArray, curry, getProp, parseOptions, setProp, partial, pipe, map, whileDo } from 'helpers/utils'

const _getElementRect = (el) => el.getBoundingClientRect()

/**
 * Add class to a list of elements. This is a curried function.
 *
 * @param {string} className
 * @param {Array<HTMLElement>} els
 * @return {Array<HTMLElement>} Same elements for chaining
 */
const addClass = curry((className, els) =>
  map((el) => {
    el.classList.add(className)
    return el
  }, els)
)

const append = curry((parent, els) => map((el) => parent.appendChild(el), els))

const appendHtml = (el, html) => {
  el.insertAdjacentHTML('beforeend', html)
  return el
}

const createNodes = (html) => {
  const wrapper = document.createElement('div')
  appendHtml(wrapper, html)
  return getChildren(wrapper)
}

const preventDefault = (e) => {
  e.preventDefault()
  return e
}

/**
 * Set style for an element.
 *
 * This is a curried function.
 *
 * @param {string} k Style name
 * @param {string} v Style value
 * @param {HTMLElement} el Element
 * @return {HTMLElement}
 */
const setStyle = curry((k, v, el) => {
  el.style[k] = v
  return el
})

const hide = setStyle('display', 'none')

/**
 * Get a style for an element.
 *
 * This is a curried function.
 *
 * @param {string} k Style name
 * @param {HTMLElement} el
 * @return {string}
 */
const getStyle = curry((k, el) => getComputedStyle(el)[k])

/**
 * Get actual height of an element, including padding
 *
 * @param {HTMLElement} el
 * @return {number}
 */
const getHeight = getProp('clientHeight')

/**
 * Get scroll top position of an element.
 *
 * Default to getting scrolling position of the viewport
 *
 * @param {HTMLElement} el
 * @return {number}
 */
const getScrollTop = (el = document.documentElement) => (el === document.documentElement ? window.pageYOffset || el.scrollTop : el.scrollTop)

/**
 * Check to see if an element has a specified class.
 *
 * @param {string} className
 * @param {HTMLElement} el
 */
const hasClass = curry((className, el) => el.classList.contains(className))

/**
 * Get attribute value for an element.
 *
 * @param {string} name
 * @param {HTMLElement} el
 * @return {string}
 * @private
 */
const _getAttribute = (name, el) => el.getAttribute(name)

/**
 * Get attribute value for an element.
 *
 * This is a curried function
 *
 * @param {string} name
 * @param {HTMLElement} el
 * @return {string}
 */
const getAttribute = curry(_getAttribute)

const setAttribute = curry((name, value, el) => {
  el.setAttribute(name, value)
  return el
})

const removeAttribute = curry((name, el) => {
  el.removeAttribute(name)
})

/**
 * Get data attribute.
 *
 * @param {string} name
 * @param {HTMLElement} el
 * @return {string} Parsed JSON value or object
 * @private
 */
const _getData = (name, el) => _getAttribute('data-' + name, el)

/**
 * Get data attribute.
 *
 * This is a curried function
 *
 * @param {string} name
 * @param {HTMLElement} el
 * @return {string}
 */
const getData = curry(_getData)

const setData = curry((name, value, el) => setAttribute('data-' + name, value, el))

/**
 * Attach event handler for a single event
 *
 * @param {string} event
 * @param {Function} handler
 * @param {Object} capture
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 * @private
 */
const _on = (event, handler, capture, el) => {
  el.addEventListener(event, handler, capture)
  return el
}

const _off = (event, handler, capture, el) => {
  el.removeEventListener(event, handler, capture)
  return el
}

const matches = (selector, el) => {
  const funcs = ['matches', 'matchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector', 'webkitMatchesSelector']

  for (const func of funcs) {
    if (typeof el[func] === 'function') {
      return el[func](selector)
    }
  }

  return false
}

/**
 * Attach event handler for a list of events.
 *
 * This is a curried function
 *
 * @param {Array|Object} els Array or array-like object
 * @param {string} event
 * @param {Function} handler
 * @return {Array<HTMLElement>}
 */
const on = curry((event, handler, els) => map(partial(_on, event, handler, {}), els))

const off = curry((event, handler, els) => map(partial(_off, event, handler, {}), els))

const onPassive = curry((event, handler, els) => map(partial(_on, event, handler, { passive: true }), els))

const onCapture = curry((event, handler, els) => map(partial(_on, event, handler, true), els))

/**
 * Check to see if document has loaded
 *
 * @return {boolean}
 * @private
 */
const _domLoaded = () => (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading')

/**
 * Call function when document is ready
 *
 * @param {Function} f
 */
const ready = (f) => (_domLoaded() ? f() : on('DOMContentLoaded', f, document))

const closest = curry((selector, el) =>
  whileDo(
    (target) => target && !matches(selector, target) && target.parentNode,
    (target) => (target.parentNode === document ? null : target.parentNode),
    el.parentNode
  )
)

const _delegate = (event, handler, selector, el) =>
  _on(
    event,
    (e) => {
      const matchedElement = whileDo(
        (target) => target && target !== document && !matches(selector, target) && target.parentNode,
        (target) => target.parentNode,
        e.target
      )

      if (matchedElement !== document && matches(selector, matchedElement)) {
        handler.apply(el, [e])
      }
    },
    {},
    el
  )

const delegate = curry((event, handler, selector, els) => map(partial(_delegate, event, handler, selector), els))

/**
 * Remove class from a list of elements. This is a curried function.
 *
 * @param {string} className
 * @param {Array<HTMLElement>} els
 * @return {Array<HTMLElement>} Same elements for chaining
 */
const removeClass = curry((className, els) =>
  map((el) => {
    el.classList.remove(className)
    return el
  }, els)
)

const toggleClass = curry((className, els) =>
  map((el) => {
    el.classList.toggle(className)
    return el
  }, els)
)

/**
 * Select one element matching a selector, which is also decendant of a parent element (defaults to document)
 * @param {string} selector
 * @param {HTMLElement|HTMLDocument=} parent
 * @return {HTMLElement}
 */
const select = (selector, parent = document) => parent.querySelector(selector)

/**
 * Select all elements matching a selector, which are also decendant of a parent element (defaults to document)
 * @param {string} selector
 * @param {HTMLElement|HTMLDocument=} parent
 * @return {Array<HTMLElement>}
 */
const selectAll = (selector, parent = document) => makeArray(parent.querySelectorAll(selector))

const getChildren = pipe(getProp('children'), makeArray)

const getParent = getProp('parentNode')

const getTopOffset = (el) => _getElementRect(el).top + getScrollTop()

const getTopPosition = getProp('offsetTop')

/**
 * Trigger reflows so that transition happens after DOM insertion
 */
const triggerReflow = (els) => {
  map(getProp('offsetHeight'), els)
  return els
}

const doesSupportObjectFit = () =>
  typeof document.documentElement.style.objectFit !== 'undefined' || typeof document.documentElement.style['object-fit'] !== 'undefined'

const trigger = (eventName, el, data = {}) => {
  let event
  if (typeof window.CustomEvent === 'function') {
    event = new CustomEvent(eventName, { detail: data })
  } else {
    event = document.createEvent('CustomEvent')
    event.initCustomEvent(eventName, true, true, data)
  }
  el.dispatchEvent(event)
  return el
}

const createElement = (tag) => document.createElement(tag)

const createScriptTag = (src, async = true, defer = true) =>
  pipe(createElement, setProp('src', src), setProp('async', async), setProp('defer', defer))('script')

const loadScript = (src, async = true, defer = true) =>
  new Promise((resolve, reject) => {
    const tag = createScriptTag(src, async, defer)
    tag.onload = resolve
    tag.onerror = reject
    append(document.body, tag)
  })

const getModuleOptions = (moduleName, el, def = {}) => parseOptions(getData(moduleName, el), def)

const getValue = getProp('value')

const remove = (el) => el.parentNode.removeChild(el)

const isIosDevice =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  (/iPad|iPhone|iPod/.test(window.navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

const handleize = (string) =>
  string
    .toLowerCase()
    .replace(/[^\w\u00C0-\u024f]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const elInViewPort = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) && ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth
}

const openModal = (id) => {
  const modal = document.querySelector(`[data-target="${id}"]`)
  if (modal) {
    modal.show(null, true)
  }
}

const hideModal = (id) => {
  const modal = document.querySelector(`[data-target="${id}"]`)
  if (modal) {
    modal.hide()
  }
}

const decodeHtml = (str) => {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

/**
 *
 * @param {HTMLFormElement} form
 * @return {Object}
 */
const formToObject = (form) => {
  const formData = new FormData(form)
  const formObject = {}

  for (const [key, value] of formData.entries()) {
    const keys = key.split('[').map((k) => k.replace(']', ''))
    let obj = formObject
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      obj[k] = obj[k] || {}
      obj = obj[k]
    }
    const k = keys[keys.length - 1]
    obj[k] = value
  }

  return formObject
}

const formatDate = (date) => {
  if (!date) return

  const dateObject = new Date(date.$d)

  if (dateObject.toString() !== 'Invalid Date') {
    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
    const day = dateObject.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  } else return date
}

export {
  addClass,
  append,
  appendHtml,
  createElement,
  createNodes,
  closest,
  delegate,
  doesSupportObjectFit,
  getAttribute,
  getChildren,
  getHeight,
  getTopOffset,
  getTopPosition,
  getData,
  getModuleOptions,
  getParent,
  getScrollTop,
  getStyle,
  getValue,
  hasClass,
  hide,
  on,
  off,
  onPassive,
  onCapture,
  loadScript,
  matches,
  preventDefault,
  ready,
  remove,
  removeAttribute,
  removeClass,
  select,
  selectAll,
  setAttribute,
  setData,
  setStyle,
  toggleClass,
  triggerReflow,
  trigger,
  isIosDevice,
  handleize,
  elInViewPort,
  openModal,
  hideModal,
  decodeHtml,
  formToObject,
  formatDate
}
