// import use SWR per next docs
/* global fetch */
import { QUERY_MAPPING } from 'uses/useCollectionNativeUtils'

export default class SearchOriginService {
  constructor(options) {
    this.options = options
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
  async getSearchOriginUrl(pathname, params) {
    if (!pathname) {
      this.warnVarError('getSearchOriginUrl', 'pathname', pathname)
    }
    if (!(params instanceof URLSearchParams)) {
      this.warnClassError('getSearchOriginUrl', pathname, 'URLSearchParams', params)
    }

    let urlParams = `&${params.toString()}`
    if (pathname === 'search') {
      urlParams = urlParams.concat('&type=product')
    }

    return `/${pathname}?view=ajax${urlParams}`
  }

  /**
   *
   * @param {URLSearchParams} params
   * @param {SearchOrigin.SortOrder} sortOrder
   * @returns {URLSearchParams}
   */
  async getSortOrder(params, sortOrder) {
    if (!params || !(params instanceof URLSearchParams)) {
      this.warnClassError('getSortOrder', 'params', 'sortOrder', params)
      params = new URLSearchParams()
    }
    if (!sortOrder || !sortOrder.value || typeof sortOrder.value !== 'string') {
      this.warnTypeError('getSortOrder', 'sortOrder.value', 'string', sortOrder)
    }
    if (sortOrder && sortOrder.direction) {
      params.append(QUERY_MAPPING.sort.param, sortOrder.direction)
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
      this.warnClassError('getFacets', 'params', 'URLSearchParams', params)
      params = new URLSearchParams()
    }
    for (const [key, values] of Object.entries(filters)) {
      if (key === `${QUERY_MAPPING.filter.code}${QUERY_MAPPING.price.param}` && values && values.length) {
        params.append(`${key}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.low}`, values[0])
        params.append(`${key}${QUERY_MAPPING.separate.code}${QUERY_MAPPING.price.high}`, values[1])
      } else {
        for (const value of values) {
          params.append(key, value)
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
   * @returns {SearchOrigin.RootObject}
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

    const searchOriginResponse = await fetch(url, config)
      .then((res) => res.json())
      .then((data) => {
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

    return searchOriginResponse
  }

  /**
   *
   * @param {string} handle
   * @param {SearchOrigin.SortOrder} sortOrder
   * @param {ActiveFilters[]} facets
   * @returns // return type to be refined
   */
  async getCollectionByHandle(handle, payload) {
    if (!handle || typeof handle !== 'string') {
      this.warnTypeError('getCollectionByHandle', 'handle', 'string', handle)
    }
    let params = new URLSearchParams()
    if (payload.sort_by) {
      params = await this.getSortOrder(params, payload.sort_by)
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

    const url = await this.getSearchOriginUrl(`collections/${handle}`, params)
    const normalizedResponse = await this.getNormalizedResponse(url, {}, handle, 'getCollectionByHandle')
    return normalizedResponse
  }

  /**
   *
   * @param {string} searchQuery
   * @param {'autocomplete' | 'search'} searchType
   * @returns {SearchOrigin.RootObject}
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

    const url = await this.getSearchOriginUrl('search', params)
    const normalizedResponse = this.getNormalizedResponse(url, {}, searchQuery, searchType)
    return normalizedResponse
  }

  getPage(params, page) {
    params.append('page', page)
    return params
  }

  /**
   * @param { SearchOrigin.Facet[] } facets
   * @returns { SearchOrigin.Facet[] } facets
   */
  async getFilters(facets, filterConfigs = []) {
    if (filterConfigs.length > 0 && facets.length > 0) {
      const advanceFilter = []
      facets.forEach((filter) => {
        if (filter.field.includes('tag')) {
          filterConfigs.forEach((config) => {
            const values = filter.values.filter((value) => value.value.indexOf(config.prefix_tag) === 0)
            if (values.length > 0) {
              filter.label = config.label
              filter.values = values
              advanceFilter.push(filter)
            }
          })
        } else {
          advanceFilter.push(filter)
        }
      })
      facets = advanceFilter
    }
    const sizeFields = facets && facets.length ? facets.find((x) => x && x.field && x.field.toLowerCase().includes('size')) : null
    if (sizeFields) {
      sizeFields.values = sizeFields.values.sort((a, b) => {
        // a and b are SearchOrigin.Facet objects. We wish to sort by the value property on each object
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

  buildPaginationPages(currentPage, totalPages) {
    if (!currentPage || !totalPages) {
      this.warnTypeError('buildPaginationPages', 'currentPage', currentPage, 'totalPages', totalPages)
      return []
    }
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (currentPage < 4 && i < 4) {
        pages.push(i)
        continue
      }

      if (i === 5 && currentPage < 3) {
        pages.push('...')
        continue
      }

      if (currentPage > totalPages - 3 && i > totalPages - 3) {
        pages.push(i)
        continue
      }

      if (i === totalPages - 3 && currentPage > totalPages - 2) {
        pages.push('...')
        continue
      }

      if (i < 2) {
        pages.push(i)
      } else if (i === currentPage - 1) {
        pages.push('...')
        pages.push(i)
      } else if (i === currentPage) {
        pages.push(i)
        continue
      } else if (i === currentPage + 1 && currentPage < totalPages - 1) {
        pages.push(i)
        pages.push('...')
      }

      if (i === totalPages) {
        pages.push(i)
      }
    }
    return pages
  }

  getPagination(pagination, payload) {
    const totalPages = pagination.totalPages

    return {
      currentPage: pagination.currentPage,
      perPage: pagination.perPage,
      totalPages: pagination.totalPages,
      totalProducts: pagination.totalResults,
      pages: this.buildPaginationPages(payload.page, totalPages)
    }
  }

  async fetch(payload) {
    if (!payload.selectedValues) {
      payload.selectedValues = {}
    }
    const response = await this.getCollectionByHandle(payload.handle, payload)
    return {
      products: response.products,
      filters: await this.getFilters(response.filters, response.filter_configs),
      sorting: response.sorting,
      pagination: await this.getPagination(response.pagination, payload)
    }
  }

  async search(payload, searchType = 'search') {
    if (!payload.selectedValues) {
      payload.selectedValues = {}
    }
    if (searchType !== 'autocomplete' && searchType !== 'search') {
      searchType = 'search'
    }
    const response = await this.getSearchResults(payload.searchQuery, searchType, payload)
    return {
      products: response.products,
      filters: await this.getFilters(response.filters, response.filter_configs),
      sorting: response.sorting,
      pagination: await this.getPagination(response.pagination, payload)
    }
  }

  async getRecommended(payload) {
    const params = new URLSearchParams()

    if (payload.productId) {
      params.append('product_id', payload.productId)
    }
    if (payload.limit) {
      params.append('limit', payload.limit)
    }

    const endpoint = `${window.Shopify.routes.root}recommendations/products.json?${params}`
    return fetch(endpoint)
      .then((response) => response.json())
      .catch((err) => {
        console.error('Could not get recommendations, returning blank results object', err)
        return {
          results: []
        }
      })
  }
}
