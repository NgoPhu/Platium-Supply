// import use SWR per next docs
/* global fetch */
import { v4 as uuidv4 } from 'uuid'
import { on } from 'helpers/dom'

/**
 * Todo:
 *
 * Performance ==================================
 *
 * Set up AbortController
 *
 * Functionality ================================
 *
 * Immediate requirements
 * * search
 * * collection by handle
 * * sort
 * * filter
 * * pagination
 *
 * Searchspring suggests: https://searchspring.zendesk.com/hc/en-us/articles/360035338492-API-Integration-Checklist
 * * autocomplete
 * * did you mean suggestions on zero result searches
 * * tracking
 *
 * Advanced features:
 * * manual redirects
 * * merchandising banners
 *
 */
export default class SearchspringService {
  constructor(options) {
    this.options = options
    on(
      'DOMContentLoaded',
      () => {
        this.setPageLoadId()
      },
      document
    )
  }

  async setPageLoadId() {
    const newPageLoadId = await this.createUUID()
    sessionStorage.setItem('ss-page-load-id', newPageLoadId)
  }

  async getPageLoadId() {
    const pageLoadId = await sessionStorage.getItem('ss-page-load-id')
    return pageLoadId
  }

  /**
   * @returns {string}
   */

  siteId() {
    return this.options.siteId
  }

  /**
   *
   * @param {string} functionName
   * @param {string} variableName
   * @param {string[]} acceptedValues
   * @param {any} variable
   * @returns {Error}
   */
  warnVarError(functionName, variableName, acceptedValues, variable) {
    console.warn(`Error on ${functionName}: ${variableName} must be one of ${acceptedValues.join(', ')}. Provided value: `, variable)
  }

  /**
   *
   * @param {string} functionName
   * @param {string} variableName
   * @param {string} className
   * @param {any} variable
   * @returns {Error}
   */
  warnTypeError(functionName, variableName, typeName, variable) {
    console.warn(`Error on ${functionName}: ${variableName} must be a ${typeName}. Provided value: `, variable)
  }

  /**
   *
   * @param {string} functionName
   * @param {string} variableName
   * @param {string} className
   * @param {any} variable
   * @returns {Error}
   */
  warnClassError(functionName, variableName, className, variable) {
    console.warn(`Error on ${functionName}: ${variableName} must be an instance of ${className}. Provided value: `, variable)
  }

  /**
   *
   * @param { 'search' | 'autocomplete' } pathname
   * @param {URLSearchParams} params
   * @returns
   */
  async getSearchspringUrl(pathname, params) {
    if (!pathname || (pathname !== 'search' && pathname !== 'autocomplete')) {
      this.warnVarError('getSearchspringUrl', 'pathname', ['search', 'autocomplete'], pathname)
    }
    if (!(params instanceof URLSearchParams)) {
      this.warnClassError('getSearchspringUrl', pathname, 'URLSearchParams', params)
    }
    params.append('resultsFormat', 'native')
    params.append('redirectResponse', 'full')
    params.append('domain', window.location.href)
    const ssUserId = await this.getSearchspringId('user')
    if (ssUserId) {
      params.append('userId', ssUserId)
    }
    const urlParams = `&${params.toString()}`
    return `https://${this.siteId()}.a.searchspring.io/api/search/${pathname}.json?siteId=${this.siteId()}${urlParams}`
  }

  /**
   *
   * @returns {string}
   */
  async createUUID() {
    return uuidv4()
  }

  /**
   *
   * @param {string} id
   * @param { 'user' | 'session' } type
   */
  async setSearchspringId(id, type) {
    if (!type || (type !== 'session' && type !== 'user')) {
      this.warnVarError('setSearchspringId', 'type', ['user', 'session'], type)
      return
    }
    if (typeof id !== 'string') {
      this.warnTypeError('setSearchspringId', 'id', 'string', id)
      return
    }
    const itemName = type === 'user' ? 'ssUserId' : 'ssSessionIdNamespace'
    try {
      if (type === 'user') {
        localStorage.setItem(itemName, id)
      } else {
        sessionStorage.setItem(itemName, id)
      }
    } catch (err) {
      console.warn('could not set searchspring session ID in Cookies', err)
    }
  }

  /**
   *
   * @param { 'user' | 'session' } type
   * @returns
   */
  async getSearchspringId(type) {
    if (!type || (type !== 'session' && type !== 'user')) {
      this.warnVarError('getSearchspringId', 'type', ['user', 'session'], type)
    }
    let searchspringId
    const storageItemName = type === 'user' ? 'ssUserId' : 'ssSessionIdNamespace'
    try {
      if (type === 'user') {
        searchspringId = localStorage.getItem(storageItemName)
      } else {
        searchspringId = sessionStorage.getItem(storageItemName)
      }
    } catch (err) {
      console.warn(`Could not access sessionStorage to get searchspring id of type: ${type}`, err)
    }
    if (searchspringId) {
      return searchspringId
    } else {
      searchspringId = await this.createUUID()
      await this.setSearchspringId(searchspringId, type)
      return searchspringId
    }
  }

  /**
   *
   * @returns { Partial<Headers> }
   */
  async getSearchspringHeaders() {
    const ssUserId = await this.getSearchspringId('user')
    const ssSessionIdNamespace = await this.getSearchspringId('session')
    const ssPageLoadId = await this.getPageLoadId()
    return {
      Accept: 'application/json',
      'searchspring-user-id': ssUserId,
      'searchspring-session-id': ssSessionIdNamespace,
      'searchspring-page-load-id': ssPageLoadId
    }
  }

  /**
   *
   * @returns {{ method: 'POST', headers: Partial<Headers> }}
   */
  async getSearchspringConfig() {
    return {
      method: 'GET',
      headers: await this.getSearchspringHeaders()
    }
  }

  /**
   *
   * @param {URLSearchParams} params
   * @param {Searchspring.SortOrder} sortOrder
   * @returns {URLSearchParams}
   */
  async getSortOrder(params, sortOrder) {
    if (!params || !(params instanceof URLSearchParams)) {
      this.warnClassError('getSortOrder', 'params', 'sortOrder', params)
      params = new URLSearchParams()
    }
    if (!sortOrder || !sortOrder.field || typeof sortOrder.field !== 'string') {
      this.warnTypeError('getSortOrder', 'sortOrder.field', 'string', sortOrder)
    }
    if (!sortOrder || !sortOrder.direction || (sortOrder.direction !== 'asc' && sortOrder.direction !== 'desc')) {
      this.warnVarError('getSortOrder', 'sortOrder.direction', ['asc', 'desc'], sortOrder)
    }
    if (sortOrder && sortOrder.field && sortOrder.direction) {
      params.append(`sort.${sortOrder.field}`, sortOrder.direction)
    }
    return params
  }

  /**
   *
   * @param {URLSearchParams} params
   * @param {ActiveFilters[]} filters
   * @returns {URLSearchParams}
   */
  async getActiveFilters(params, filters) {
    if (!params || !(params instanceof URLSearchParams)) {
      await this.warnClassError('getFacets', 'params', 'URLSearchParams', params)
      params = new URLSearchParams()
    }
    for (const [key, values] of Object.entries(filters)) {
      if (key === 'ss_price' && values && values.length) {
        params.append(`filter.${key}.low`, values[0])
        params.append(`filter.${key}.high`, values[1])
      } else if (key === 'ss_days_since_published' && values && values.length) {
        params.append(`filter.${key}.low`, values[0])
        params.append(`filter.${key}.high`, values[1])
      } else {
        for (const value of values) {
          params.append(`filter.${key}`, value)
        }
      }
    }
    return params
  }

  /**
   *
   * @param {string} url
   * @param {any} config
   * @param {string} searchQuery
   * @param {'getCollectionByHandle' | 'autocomplete' | 'search'} searchType
   * @returns {Searchspring.RootObject}
   */
  async getNormalizedResponse(url, config, searchQuery, searchType) {
    if (!url || typeof url !== 'string') {
      this.warnTypeError('getNormalizedResponse', 'url', 'string', url)
    }
    if (!config || typeof config !== 'object') {
      this.warnTypeError('getNormalizedResponse', 'config', 'object: any', config)
    }
    if (!searchQuery || typeof searchQuery !== 'string') {
      this.warnTypeError('getNormalizedResponse', 'searchQuery', 'string', url)
    }

    const searchspringResponse = await fetch(url, config)
      .then((res) => res.json())
      .then((data) => {
        // console.log('query', searchQuery)
        // if (data.results.length) console.log('data', data)
        if (data && data.sorting && data.sorting.options && data.sorting.options.length) {
          data.sorting.options = data.sorting.options.map((x) => {
            return {
              ...x,
              active: x.active === null || x.active === undefined ? 0 : x.active
            }
          })
        }
        return data
      })
      .catch((err) => {
        console.warn('Error fetching for', searchType, 'searching ', searchQuery, 'err: ', err)
        return []
      })

    return searchspringResponse
  }

  /**
   *
   * @param {string} handle
   * @param {Searchspring.SortOrder} sortOrder
   * @param {ActiveFilters[]} facets
   * @returns // return type to be refined
   */
  async getCollectionByHandle(handle, payload) {
    if (!handle || typeof handle !== 'string') {
      this.warnTypeError('getCollectionByHandle', 'handle', 'string', handle)
    }
    let params = new URLSearchParams()
    params.append('bgfilter.collection_handle', handle)
    // console.log('sortOrder', sortOrder)
    if (payload.sort) {
      params = await this.getSortOrder(params, payload.sort)
    }
    if (payload.selectedValues) {
      params = await this.getActiveFilters(params, payload.selectedValues)
    }
    if (payload.page) {
      params = this.getPage(params, payload.page)
    }

    if (payload.perPage) {
      params.append('resultsPerPage', payload.perPage)
    }

    const url = await this.getSearchspringUrl('search', params)
    const config = await this.getSearchspringConfig()
    const normalizedResponse = await this.getNormalizedResponse(url, config, handle, 'getCollectionByHandle')
    return normalizedResponse
  }

  /**
   *
   * @param {string} searchQuery
   * @param {'autocomplete' | 'search'} searchType
   * @returns {Searchspring.RootObject}
   */
  async getSearchResults(searchQuery, searchType, payload) {
    if (!searchQuery || typeof searchQuery !== 'string') {
      this.warnTypeError('getSearchResults', 'searchQuery', 'string', searchQuery)
    }
    if (!searchType || (searchType !== 'autocomplete' && searchType !== 'search')) {
      this.warnClassError('getSearchResults', 'searchType', ['autocomplete', 'search'], searchType)
    }
    let params = new URLSearchParams()
    params.append('q', searchQuery)
    if (payload) {
      if (payload.originalQuery) {
        params.append('oq', payload.originalQuery)
      }
      if (payload.sort) {
        params = await this.getSortOrder(params, payload.sort)
      }
      if (payload.selectedValues) {
        params = await this.getActiveFilters(params, payload.selectedValues)
      }
      if (payload.page) {
        params = this.getPage(params, payload.page)
      }
      if (payload.tag) {
        params.append('tag', payload.tag)
      }
      if (payload.perPage) {
        params.append('resultsPerPage', payload.perPage)
      }
    }
    const url = await this.getSearchspringUrl(searchType, params)
    const config = await this.getSearchspringConfig()
    const normalizedResponse = this.getNormalizedResponse(url, config, searchQuery, searchType)
    return normalizedResponse
  }

  getPage(params, page) {
    params.append('page', page)
    return params
  }

  /**
   * @param { Searchspring.Facet[] } facets
   * @returns { Searchspring.Facet[] } facets
   */
  async getFilters(facets) {
    const sizeFields = facets.find((x) => x && x.field && x.field.toLowerCase().includes('size'))
    if (sizeFields) {
      sizeFields.values = sizeFields.values.sort((a, b) => {
        // a and b are Searchspring.Facet objects. We wish to sort by the value property on each object
        const A = a.value
        const B = b.value
        // check whether two items are the same number, but include a string - eg 7 and 7h.
        // 7H is 7 and a half, and should come after 7.
        if (parseInt(A) === parseInt(B) && (isNaN(A) || isNaN(B))) {
          return A < B ? -1 : 1
        }
        // convert to numbers so that 10 comes after 8
        return parseInt(A) < parseInt(B) ? -1 : 1
      })
    }
    return facets
  }

  async fetch(payload) {
    if (!payload.selectedValues) {
      payload.selectedValues = {}
    }
    const response = await this.getCollectionByHandle(payload.handle, payload)
    return {
      products: response.results,
      filters: await this.getFilters(response.facets),
      sorting: response.sorting,
      pagination: response.pagination,
      merchandising: response.merchandising,
      breadcrumbs: response.breadcrumbs
    }
  }

  async search(payload, searchType = 'search') {
    let response = null
    if (!payload.selectedValues) {
      payload.selectedValues = {}
    }
    if (searchType !== 'autocomplete' && searchType !== 'search') {
      searchType = 'search'
    }
    response = await this.getSearchResults(payload.searchQuery, searchType, payload)
    const isRedirect = response && response.merchandising && response.merchandising.redirect
    if (isRedirect) {
      window.location.replace(isRedirect)
    }
    return {
      products: response.results,
      filters: await this.getFilters(response.facets),
      sorting: response.sorting,
      pagination: response.pagination,
      merchandising: response.merchandising,
      breadcrumbs: response.breadcrumbs
    }
  }

  /**
   *
   * @param {string} inputValue
   * @returns { SearchspringSuggest.RootObject }
   */
  async getSuggestion(inputValue) {
    const siteId = this.siteId()
    const url = `https://${siteId}.a.searchspring.io/api/suggest/query?siteId=${siteId}&query=${inputValue}&language=en&suggestionCount=4&&productCount=5`
    return fetch(url)
  }

  async getRecommended(payload) {
    const siteId = this.siteId()
    const params = new URLSearchParams()
    params.append('siteId', siteId)

    if (payload.productId) {
      params.append('product', payload.productId)
    }
    if (payload.lastViewed) {
      params.append('lastViewed', payload.lastViewed)
    }
    if (payload.tags) {
      params.append('tags', payload.tags)
    }
    if (payload.limits) {
      params.append('limits', payload.limits)
    }
    if (payload.cart) {
      params.append('cart', payload.cart)
    }
    if (payload.shopper) {
      params.append('shopper', payload.shopper)
    }

    const endpoint = `https://${siteId}.a.searchspring.io/boost/${siteId}/recommend?${params}`
    return fetch(endpoint)
      .then((response) => response.json())
      .catch((err) => {
        console.error('Could not get recommendations, returning blank results object', err)
        return {
          profile: {
            tag: payload.tags
          },
          results: []
        }
      })
  }
}
