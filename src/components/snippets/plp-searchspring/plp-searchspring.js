import appState from 'snippets/plp-searchspring/@store'
import { createContext } from 'preact'
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { isEmpty } from 'helpers/utils'
import { QUERY_MAPPING, groupParamsByKey } from 'uses/useSearchspringUtils'
import { PlpFilterBar } from 'snippets/plp-filter-bar/plp-filter-bar'
import PlpFilter from 'snippets/plp-filter/plp-filter'
import PlpFilterSelected from 'snippets/plp-filter-selected/plp-filter-selected'
import PlpGrid from 'snippets/plp-grid/plp-grid'
import PlpPagination from 'snippets/plp-pagination/plp-pagination'
import PlpBanner from 'snippets/plp-banner/plp-banner'
import { on, getTopOffset, getHeight, addClass, removeClass } from 'helpers/dom'
import throttle from 'lodash.throttle'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'

const AppState = createContext()
const IS_STICKY_CLASS = 'is-sticky'

function PlpMain(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App(props) {
  const state = useContext(AppState)
  const handle = props.slot.handle !== '' && props.slot.handle !== 'all' ? props.slot.handle : ''
  const { isMobile } = useDetectBreakpoint()
  const isLoading = useMemo(() => state.isLoading.value, [state.isLoading.value])
  const filters = useMemo(() => state.filters.value, [state.filters.value])
  const products = useMemo(() => state.products.value, [state.products.value])
  const pagination = useMemo(() => state.pagination.value, [state.pagination.value])
  const activeFilters = useMemo(() => state.activeFilters.value, [state.activeFilters.value])
  const sortOptions = useMemo(() => state.sortOptions.value, [state.sortOptions.value])
  const sortOrder = useMemo(() => state.sortOrder.value, [state.sortOrder.value])
  const selectedValues = useMemo(() => state.selectedValues.value, [state.selectedValues.value])
  const merchandising = useMemo(() => state.merchandising.value, [state.merchandising.value])
  const refPlpFilterBar = useRef(null)
  const [isScroll, setIsScroll] = useState(false)

  function initFilters() {
    const paramsString = window.location.href.split('?')[1]
    const isSearchPage = window.location.pathname === '/search'
    const paramsDefault = groupParamsByKey(new URLSearchParams(paramsString))
    if (window.location.pathname.includes(QUERY_MAPPING.search.path) || isSearchPage) {
      state.initFilters({
        searchQuery: paramsDefault.searchQuery,
        originalQuery: paramsDefault.originalQuery,
        ...paramsDefault
      })
      state.updateSearchQuery(paramsDefault.searchQuery)
      state.updateOriginalQuery(paramsDefault.originalQuery)
      state.updateResults(paramsDefault.results)
    } else {
      state.initFilters({
        handle,
        ...paramsDefault
      })
      state.updateHandle(handle)
    }
  }

  function addEventPopstate() {
    window.addEventListener('popstate', (event) => {
      const finalParams = event.state !== null ? event.state.params : {}
      const finalUrl = event.state !== null ? event.state.url : null
      finalParams.forceUpdate = false
      const isSearchPage = finalUrl === '/search'
      if ((finalUrl && finalUrl.includes(QUERY_MAPPING.search.path)) || isSearchPage) {
        state.initFilters({
          searchQuery: finalParams.searchQuery,
          ...finalParams
        })
        state.updateSearchQuery(finalParams.searchQuery)
      } else {
        state.onPopState({
          handle,
          ...finalParams
        })
        state.updateHandle(handle)
      }
    })
  }

  function activeFilterSticky() {
    const plpFilterHeight = getHeight(refPlpFilterBar.current)
    const plpFilterOffset = getTopOffset(refPlpFilterBar.current)
    let lastScrollTop = 0

    on(
      'scroll',
      throttle(() => {
        if (window.pageYOffset > lastScrollTop) {
          if (window.pageYOffset > plpFilterOffset + plpFilterHeight) {
            addClass(IS_STICKY_CLASS, refPlpFilterBar.current)
          }
        } else {
          if (window.pageYOffset <= plpFilterOffset - plpFilterHeight) {
            removeClass(IS_STICKY_CLASS, refPlpFilterBar.current)
          }
        }
        lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset
      }, 100),
      window
    )
  }

  function scrollTop() {
    if (!isLoading) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    initFilters()
    addEventPopstate()
    activeFilterSticky()
  }, [])

  useEffect(() => {
    if (!isScroll) {
      scrollTop()
      setIsScroll(true)
    }
  }, [isLoading])

  return (
    <div className="flex flex-col">
      {merchandising && merchandising.header && <PlpBanner banners={merchandising.header} classItem="mb-2 lg:mb-4" />}
      {merchandising && merchandising.banner && <PlpBanner banners={merchandising.banner} classItem="mb-2 lg:mb-4 last:mb-0" />}
      <div
        className="container top-[56px] z-20 border-b border-default bg-white md:top-[130px] xl:top-0 xl:transition-all xl:delay-300 xl:duration-300 xl-max:sticky xl:[&.is-sticky]:sticky xl:[&.is-sticky]:top-[74px]"
        ref={refPlpFilterBar}
      >
        <div className="relative my-4">
          <PlpFilterBar
            isMobile={isMobile}
            isLoading={isLoading}
            sortOptions={sortOptions}
            sortOrder={sortOrder}
            pagination={pagination}
            activeFilters={activeFilters}
            setActiveFilters={state.setActiveFilters}
            applySort={state.applySort}
            selectedValues={selectedValues}
          />
        </div>
      </div>
      <div className="lg:flex">
        <div className={`overflow-hidden transition-all lg:w-72 lg:border-r ${!isMobile && !activeFilters ? '!w-0 -translate-x-full' : ''}`}>
          <PlpFilter
            isMobile={isMobile}
            isLoading={isLoading}
            filters={filters}
            activeFilters={activeFilters}
            selectedValues={selectedValues}
            setActiveFilters={state.setActiveFilters}
            applyFilters={state.applyFilters}
            merchandising={merchandising}
          />
        </div>
        <div className="transition-all lg:flex-1">
          {!isLoading && !isEmpty(selectedValues) && <PlpFilterSelected selectedValues={selectedValues} applyFilters={state.applyFilters} />}
          <PlpGrid isLoading={isLoading} products={products} handle={handle} />
          <PlpPagination isLoading={isLoading} pagination={pagination} goToPage={state.goToPage} />
        </div>
      </div>
      {merchandising && merchandising.footer && <PlpBanner banners={merchandising.footer} classItem="mb-2 lg:mb-4 last:mb-0" />}
    </div>
  )
}

export default PlpMain
