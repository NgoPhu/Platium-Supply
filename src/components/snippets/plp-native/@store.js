import { signal } from '@preact/signals'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { QUERY_MAPPING } from 'uses/useCollectionNativeUtils'
import { on, select, getHeight } from 'helpers/dom'
import { hasOwnProperties } from 'helpers/utils'
import CollectionNative from 'uses/useCollectionNative'
import debounce from 'lodash.debounce'
import { detectBreakpoint } from 'helpers/global'

const selectors = {
  productPerPage: 12,
  headerClass: '.js-header-sticky',
  plpClass: '.js-plp-native',
  plpSlidoutContent: '.js-plp-filter-slideout-content'
}

function appState() {
  const CollectionNativeInstance = new CollectionNative()
  const activeFilters = signal(false)
  const isLoading = signal(false)
  const searchQuery = signal('')
  const originalQuery = signal('')
  const handle = signal('')
  const sortOrder = signal(null)
  const currentPage = signal(1)
  const selectedValues = signal({})
  const sortOptions = signal([])
  const filters = signal([])
  const pagination = signal(null)
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
    if (payload.forceUpdate) {
      await applyFilters(payload)
    } else {
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
  }

  function scrollToPopState() {
    const scrollPos = sessionStorage.getItem('scrollPos')
    if (scrollPos && scrollPos < document.documentElement.scrollHeight) {
      window.scrollTo(0, scrollPos)
      sessionStorage.removeItem('scrollPos')
    }
  }

  async function applyFilters(payload) {
    isLoading.value = true

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

    if (payload.sort_by) {
      sortOrder.value = payload.sort_by
    } else {
      payload.sort_by = sortOrder.value
    }

    if (payload.page) {
      currentPage.value = payload.page
    } else {
      payload.page = currentPage.value
    }

    payload.perPage = selectors.productPerPage

    if (payload.selectedValues) {
      selectedValues.value = payload.selectedValues
    } else {
      payload.selectedValues = selectedValues.value
    }

    try {
      if (isSearch) {
        response = await CollectionNativeInstance.search(payload)
      } else {
        response = await CollectionNativeInstance.fetch(payload)
      }
    } catch (e) {
      // TODO: Handle error
      console.error(e)
    }
    if (response) {
      if (isSearch) {
        const title = document.head.querySelector('title')
        const titleSplit = title.innerHTML.split(' - ')
        const searchTitle = `Search ${response.pagination.totalProducts} results for ${payload.searchQuery}`

        title.innerHTML = [searchTitle, titleSplit[1]].join(' - ')
      }
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

    sortOptions.value = response.sorting.options
    pagination.value = response.pagination

    if (payload.event_type === 'init') {
      filters.value = response.filters
    }

    changeQueryUrl(payload)
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
          if (key === `${QUERY_MAPPING.filter.param}${QUERY_MAPPING.price.param}`) {
            queryParams.append(`${QUERY_MAPPING.filter.param}${QUERY_MAPPING.price.param}.${QUERY_MAPPING.price.low}`, values[0])
            queryParams.append(`${QUERY_MAPPING.filter.param}${QUERY_MAPPING.price.param}.${QUERY_MAPPING.price.high}`, values[1])
          } else {
            for (const value of values) {
              queryParams.append(key, value)
            }
          }
        }
      }
    }

    if (payload.sort_by && payload.sort_by.direction) {
      queryParams.append(`${QUERY_MAPPING.sort.param}`, payload.sort_by.direction)
    }

    if (payload.page > 1) {
      queryParams.append(QUERY_MAPPING.page.param, payload.page)
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

  function updateHandle(value) {
    handle.value = value
  }

  function setActiveFilters() {
    activeFilters.value = !activeFilters.value
    activeFilters.value ? disableBodyScroll(select(selectors.plpSlidoutContent)) : clearAllBodyScrollLocks()
  }

  async function goToPage([page, paginationType = 'more']) {
    const payload = {
      sort: sortOrder.value,
      selectedValues: selectedValues.value,
      page,
      paginationType,
      forceUpdate: true
    }

    await applyFilters(payload)
  }

  const setSelectedValues = (values) => {
    selectedValues.value = values
  }

  async function applySort(sort) {
    const payload = {
      sort,
      selectedValues: selectedValues.value,
      page: 1
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
    updateHandle,
    applyFilters,
    applySort,
    goToPage,
    setSelectedValues
  }
}

export default appState
