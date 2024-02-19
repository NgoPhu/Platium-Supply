/* global collectionConfig */
import appState from './@store'
import { createContext } from 'preact'
import { isEmpty } from 'helpers/utils'
import Icon from 'snippets/icon/icon'
import { useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { QUERY_MAPPING, groupParamsByKey } from 'uses/useCollectionNativeUtils'
import { PlpFilterBar, PlpFilterCount, PlpFilterSkeleton } from 'snippets/plp-filter-bar/plp-filter-bar'
import PlpFilter from 'snippets/plp-filter/plp-filter'
import PlpNativeGrid from 'snippets/plp-native-grid/plp-native-grid'
import PlpFilterSelected from 'snippets/plp-filter-selected/plp-filter-selected'
import PlpPaginationNative from 'snippets/plp-pagination/plp-pagination-native'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'
import PlpInlineUser from 'snippets/plp-inline-user/plp-inline-user'
import PlpInlineBanner from 'snippets/plp-inline-banner/plp-inline-banner'
import PlpUser from 'snippets/plp-user/plp-user'
import { getTopOffset, addClass, removeClass, on, select } from 'helpers/dom'
import throttle from 'lodash.throttle'

const selectors = {
  plpNative: '.js-plp-native',
  stickyClass: 'is-plp-sticky',
  plpInlineUser: '.js-plp-inline-user'
}

const AppState = createContext()

function PlpOrigin(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App(props) {
  const state = useContext(AppState)
  const refPlpFilterBar = useRef(null)
  const refPlpNative = useRef(null)
  const handle = props.slot.handle
  const { isMobile } = useDetectBreakpoint()
  const { title, searchTitle } = window.plpState

  const isLoading = useMemo(() => state.isLoading.value, [state.isLoading.value])
  const filters = useMemo(() => state.filters.value, [state.filters.value])
  const products = useMemo(() => state.products.value, [state.products.value])
  const pagination = useMemo(() => state.pagination.value, [state.pagination.value])
  const activeFilters = useMemo(() => state.activeFilters.value, [state.activeFilters.value])
  const sortOptions = useMemo(() => state.sortOptions.value, [state.sortOptions.value])
  const sortOrder = useMemo(() => state.sortOrder.value, [state.sortOrder.value])
  const selectedValues = useMemo(() => state.selectedValues.value, [state.selectedValues.value])
  const isSearchPage = window.location.pathname === '/search'
  const [layout, setLayout] = useState('grid')
  const toggleLayout = (newLayout) => {
    setLayout(newLayout)
  }

  function initFilters() {
    const paramsString = window.location.href.split('?')[1]
    const isSearchPage = window.location.pathname === '/search'
    const paramsDefault = groupParamsByKey(new URLSearchParams(paramsString))
    paramsDefault.forceUpdate = true
    if (window.location.pathname.includes(QUERY_MAPPING.search.path) || isSearchPage) {
      state.initFilters({
        searchQuery: paramsDefault.searchQuery,
        originalQuery: paramsDefault.originalQuery,
        ...paramsDefault
      })
      state.updateSearchQuery(paramsDefault.searchQuery)
      state.updateOriginalQuery(paramsDefault.originalQuery)
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
      finalParams.forceUpdate = true
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

  const handleScroll = () => {
    const plpInlineUser = select(selectors.plpInlineUser)
    let offset
    if (plpInlineUser) {
      offset = getTopOffset(refPlpNative.current) + 60
    } else {
      offset = 160
    }
    on(
      'scroll',
      throttle(() => {
        if (window.scrollY > offset) {
          addClass(selectors.stickyClass, refPlpNative.current)
        } else {
          removeClass(selectors.stickyClass, refPlpNative.current)
        }
      }, 100),
      window
    )
  }

  useEffect(() => {
    initFilters()
    addEventPopstate()
    handleScroll()
  }, [])

  return (
    <div className="lg:container" ref={refPlpNative}>
      <div className="lg:flex lg:gap-12 lg:pb-[72px]">
        <div className={`overflow-hidden transition-all lg:w-[268px] lg:sticky lg:top-[170px] lg:h-fit ${pagination?.pages.length > 1 ? 'lg:mb-[136px]' : ''}`}>
          <div className="lg:hidden"><PlpInlineBanner /></div>
          {!isSearchPage && <PlpInlineUser className="w-full" isMobile={isMobile} />}
          <div className={`lg:bg-white lg:rounded-[10px] lg:shadow-base lg:border lg:px-5 lg:py-6 ${isSearchPage ? 'lg:my-0' : 'lg:my-6'}`}>
            {!isMobile && !isLoading && !isEmpty(selectedValues) && <PlpFilterSelected filters={filters} selectedValues={selectedValues} applyFilters={state.applyFilters} />}
            <PlpFilter
              isMobile={isMobile}
              isLoading={isLoading}
              filters={filters}
              activeFilters={activeFilters}
              selectedValues={selectedValues}
              setActiveFilters={state.setActiveFilters}
              applyFilters={state.applyFilters}
            />
          </div>
        </div>
        <div className="transition-all lg:flex-1 lg-max:container">
          <div className="lg-max:hidden"><PlpInlineBanner /></div>
          <div className="js-plp-filter-group">
            {isSearchPage && (
              <div className="text-xl font-bold font-body text-grey-900 lg:hidden">{searchTitle}</div>
            )}
            <div className={`flex items-center justify-between lg:hidden ${isSearchPage ? 'mt-3' : 'mt-5'}`}>
              {!isLoading && pagination ? (
                <div className="flex items-center">
                  {!isSearchPage && (
                    <div className="mr-2 text-xl font-bold text-grey-900 lg:text-2xl">{title}</div>
                  )}
                  <PlpFilterCount total={pagination.totalProducts} />
                </div>
              ) : <PlpFilterSkeleton className="w-[67px] pr-6" />}
              <div className="lg:hidden">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleLayout('grid')}><Icon name="icon-grid" className={`text-custom-1 ${layout === 'grid' ? 'text-secondary' : ''}`} /></button>
                  <button onClick={() => toggleLayout('list')}><Icon name="icon-list" className={`text-custom-1 ${layout === 'list' ? 'text-secondary' : ''}`} /></button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`lg-max:sticky lg-max:top-32 lg-max:z-20 lg-max:[.is-plp-sticky_&]:-mx-6 md-max:[.is-plp-sticky_&]:!-mx-4 lg:border-b lg:border-custom-1 js-plp-filter-bar ${isSearchPage ? '' : 'lg:pt-8'}`}
            ref={refPlpFilterBar}
          >
            <div className="relative lg:pb-3">
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
                toggleLayout={toggleLayout}
                isSearchPage={isSearchPage}
                layout={layout}
              />
            </div>
          </div>
          <PlpNativeGrid layout={layout} isLoading={isLoading} products={products} handle={handle} />
          <PlpPaginationNative isLoading={isLoading} pagination={pagination} goToPage={state.goToPage} />
          {isMobile && !isSearchPage && <PlpUser className="w-full mt-8" />}
        </div>
      </div>
    </div>
  )
}

export default PlpOrigin
