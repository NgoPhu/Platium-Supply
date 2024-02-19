import { signal } from '@preact/signals'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { QUERY_MAPPING } from 'uses/useSearchspringUtils'
import { on, select, getHeight } from 'helpers/dom'
import { hasOwnProperties } from 'helpers/utils'
import SearchSpringService from 'uses/useSearchspring'
import debounce from 'lodash.debounce'
import { detectBreakpoint } from 'helpers/global'

const { searchSpringConfig } = window.GM_STATE.integrations

const selectors = {
  headerClass: '.js-header-sticky',
  plpClass: '.js-plp-main'
}

function appState() {
  const SearchSpringInstance = new SearchSpringService({
    siteId: searchSpringConfig.siteId,
    enable: searchSpringConfig.enable
  })

  const activeFilters = signal(!detectBreakpoint())
  const isLoading = signal(false)
  const isPrevLoading = signal(false)
  const searchQuery = signal('')
  const originalQuery = signal('')
  const handle = signal('')
  const sortOrder = signal(null)
  const currentPage = signal(1)
  const perPage = signal(24)
  const selectedValues = signal({})
  const sortOptions = signal([])
  const filters = signal([])
  const pagination = signal(null)
  const results = signal('')
  const products = signal(null)
  const merchandising = signal(null)

  async function initFilters(payload = {}) {
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    payload.event_type = 'init'
    await getDataProducts({ payload, isScroll: true })
    on(
      'scroll',
      debounce(() => {
        sessionStorage.setItem('scrollPos', window.scrollY)
      }, 200),
      window
    )
    sessionStorage.setItem('scrollPos', window.scrollY)
  }

  function onPopState(payload = {}) {
    setProducts([])
    payload.event_type = 'popState'
    getDataProducts({ payload, isScroll: false })
  }

  async function getDataProducts({ payload = {}, isScroll = false }) {
    const page = payload.page || 1
    payload.history = false
    if (!isScroll) {
      const plpEl = select(selectors.plpClass)
      const headerEl = select(selectors.headerClass)
      const offset = plpEl.offsetTop - getHeight(headerEl)
      window.scrollTo(0, offset)
    }
    for (let i = 1; i <= page; i++) {
      payload.page = i
      if (page === i) {
        payload.history = true
      }
      await applyFilters(payload)
      !!isScroll && scrollToPopState()
    }
  }

  function scrollToPopState() {
    const scrollPos = sessionStorage.getItem('scrollPos')
    if (scrollPos && scrollPos < document.documentElement.scrollHeight) {
      window.scrollTo(0, scrollPos)
      sessionStorage.removeItem('scrollPos')
    }
  }

  function spliceInlineContent(payload) {
    const [products, banners, pagination] = [payload.products, payload.content, payload.pagination]
    for (const banner of banners) {
      const index = banner.config.position.index === 0 ? 1 : banner.config.position.index
      if (index >= pagination.begin && index <= pagination.end) {
        const realIndex = banner.config.position.index - pagination.begin + 1
        banner.key = Math.random().toFixed(12).split('.')[1]
        products.splice(realIndex, 0, banner)
      }
    }
    return payload.products
  }

  async function applyFilters(payload) {
    isLoading.value = true

    if (payload.paginationType === 'prev') {
      isPrevLoading.value = true
    }

    let response

    const isSearch = hasOwnProperties(QUERY_MAPPING.search.param, payload) || location.pathname.includes(QUERY_MAPPING.search.path)

    if (isSearch) {
      if (payload.searchQuery) {
        searchQuery.value = payload.searchQuery
      } else {
        payload.searchQuery = searchQuery.value || ''
      }
      if (payload.originalQuery) {
        originalQuery.value = payload.originalQuery
      } else {
        payload.originalQuery = originalQuery.value || ''
      }
    } else {
      if (payload.handle) {
        handle.value = payload.handle
      } else {
        payload.handle = handle.value
      }
    }

    if (payload.sort) {
      sortOrder.value = payload.sort
    } else {
      payload.sort = sortOrder.value
    }

    if (payload.page) {
      currentPage.value = payload.page
    } else {
      payload.page = currentPage.value
    }

    if (payload.perPage) {
      perPage.value = payload.perPage
    } else {
      payload.perPage = perPage.value
    }

    if (payload.selectedValues) {
      selectedValues.value = payload.selectedValues
    } else {
      payload.selectedValues = selectedValues.value
    }

    try {
      if (isSearch) {
        response = await SearchSpringInstance.search(payload)
      } else {
        response = await SearchSpringInstance.fetch(payload)
      }
    } catch (e) {
      // TODO: Handle error
      console.error(e)
    }
    if (
      response &&
      response.merchandising &&
      response.merchandising.content &&
      response.merchandising.content.inline &&
      response.merchandising.content.inline.length > 0
    ) {
      if (payload.page === 1 || payload.forceUpdate) {
        products.value = spliceInlineContent({
          products: response.products,
          content: response.merchandising.content.inline,
          pagination: response.pagination
        })
      } else {
        if (payload.paginationType === 'prev') {
          products.value = response.products.concat(
            spliceInlineContent({
              products: products.value,
              content: response.merchandising.content.inline,
              pagination: response.pagination
            })
          )
        } else {
          products.value = products.value.concat(
            spliceInlineContent({
              products: response.products,
              content: response.merchandising.content.inline,
              pagination: response.pagination
            })
          )
        }
      }
    } else {
      if (payload.page === 1 || payload.forceUpdate) {
        setProducts(response.products)
      } else {
        if (payload.paginationType === 'prev') {
          products.value = response.products.concat(products.value)
        } else {
          products.value = products.value.concat(response.products)
        }
      }
    }

    if (response && response.merchandising && response.merchandising.content) {
      merchandising.value = response.merchandising.content
    }

    sortOptions.value = response.sorting.options

    if (payload.event_type === 'init') {
      filters.value = response.filters
    }

    if (payload.paginationType !== 'prev') {
      pagination.value = response.pagination
      changeQueryUrl(payload)
    } else {
      isPrevLoading.value = false
    }

    isLoading.value = false
  }

  function changeQueryUrl(payload = {}) {
    const queryParams = new URLSearchParams(location.search)
    const queryParams2 = new URLSearchParams(location.search)
    queryParams2.forEach((value, key) => {
      const hasKey = Object.entries(QUERY_MAPPING).some((item) => key.indexOf(item[1].code) === 0)
      hasKey && queryParams.delete(key)
    })

    if (payload.searchQuery || searchQuery.value) {
      queryParams.append('q', payload.searchQuery || searchQuery.value)
    }
    const originalQueryValue = originalQuery.value || payload.originalQuery || ''
    const searchQueryValue = searchQuery.value || payload.searchQuery || ''
    if (originalQueryValue && originalQueryValue !== searchQueryValue) {
      queryParams.append('oq', payload.originalQuery || originalQuery.value)
    }

    if (payload.selectedValues && Object.keys(payload.selectedValues).length > 0) {
      for (const [key, values] of Object.entries(payload.selectedValues)) {
        if (values.length > 0) {
          if (key === `${QUERY_MAPPING.price.param}`) {
            queryParams.append(`${QUERY_MAPPING.filter.param}${QUERY_MAPPING.price.param}.${QUERY_MAPPING.price.low}`, values[0])
            queryParams.append(`${QUERY_MAPPING.filter.param}${QUERY_MAPPING.price.param}.${QUERY_MAPPING.price.high}`, values[1])
          } else if (key === 'ss_days_since_published') {
            queryParams.append(`${QUERY_MAPPING.filter.param}ss_days_since_published.low`, values[0])
            queryParams.append(`${QUERY_MAPPING.filter.param}ss_days_since_published.high`, values[1])
          } else {
            for (const value of values) {
              queryParams.append(`${QUERY_MAPPING.filter.param}${key}`, value)
            }
          }
        }
      }
    }

    if (payload.sort && payload.sort.direction && payload.sort.field) {
      queryParams.append(`${QUERY_MAPPING.sort.param}.${payload.sort.direction}`, payload.sort.field)
    }

    if (payload.page > 1) {
      queryParams.append(QUERY_MAPPING.page.param, payload.page)
    }

    if (payload.perPage && payload.perPage !== searchSpringConfig.perPage) {
      queryParams.append(QUERY_MAPPING.perPage.param, payload.perPage)
    }

    if (payload.tag) {
      queryParams.append(QUERY_MAPPING.tag.param, payload.tag)
    }

    if (payload.results) {
      queryParams.append(QUERY_MAPPING.results.param, payload.results)
    }

    const finalUrl = `${window.location.origin}${window.location.pathname}${queryParams.toString() !== '' ? '?' : ''}${queryParams.toString()}`

    if (payload.event_type !== 'popState') {
      history.pushState(
        {
          params: payload,
          url: finalUrl
        },
        null,
        finalUrl
      )
    }
  }

  function updateSearchQuery(value) {
    searchQuery.value = value
  }

  function setProducts(value) {
    products.value = value
  }

  function updateOriginalQuery(value) {
    originalQuery.value = value
  }

  function updateResults(value) {
    results.value = value
  }

  function updateHandle(value) {
    handle.value = value
  }

  function setActiveFilters() {
    activeFilters.value = !activeFilters.value
    activeFilters.value ? disableBodyScroll(document.body) : clearAllBodyScrollLocks()
  }

  async function goToPage([page, paginationType = 'more']) {
    const payload = {
      sort: sortOrder.value,
      selectedValues: selectedValues.value,
      page,
      paginationType
    }

    await applyFilters(payload)
  }

  const setSelectedValues = (values) => {
    selectedValues.value = values
  }

  async function applySort(sort) {
    const payload = {
      sort,
      selectedValues: selectedValues.value
    }

    sortOrder.value = sort

    await applyFilters(payload)
  }

  return {
    isLoading,
    products,
    pagination,
    sortOptions,
    sortOrder,
    filters,
    activeFilters,
    selectedValues,
    merchandising,
    setActiveFilters,
    initFilters,
    onPopState,
    updateSearchQuery,
    updateOriginalQuery,
    updateResults,
    updateHandle,
    applyFilters,
    applySort,
    goToPage,
    setSelectedValues
  }
}

export default appState
