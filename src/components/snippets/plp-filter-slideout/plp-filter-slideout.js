import { Fragment } from 'preact'
import { useState, useMemo } from 'preact/hooks'
import { isEmpty } from 'helpers/utils'
import { getSelectedValues } from 'uses/useSearchspringUtils'
import Icon from 'snippets/icon/icon'
import PlpFilterPanel from 'snippets/plp-filter-panel/plp-filter-panel'
import PlpFilterApply from 'snippets/plp-filter-apply/plp-filter-apply'
import PlpFilterSkeleton from 'snippets/plp-filter-skeleton/plp-filter-skeleton'
import { select, getTopOffset, getHeight } from 'helpers/dom'

const selectors = {
  priceKey: 'filter.v.price',
  plpFilterGroup: '.js-plp-filter-group',
  siteHeader: '#shopify-section-site-header'
}

function PlpFilterSlideout({ isMobile, isLoading, filters, activeFilters, selectedValues, setActiveFilters, applyFilters }) {
  const [selected, setSelected] = useState([])
  const values = useMemo(() => getSelectedValues(selectedValues, selectors.priceKey), [selectedValues])

  const handleScroll = () => {
    const plpFilterGroupEl = select(selectors.plpFilterGroup)
    const siteHeaderEl = select(selectors.siteHeader)
    if (!plpFilterGroupEl) return
    const offset = getTopOffset(plpFilterGroupEl) - getHeight(siteHeaderEl)
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
  }

  const handleClose = () => setActiveFilters()

  const handleApply = () => {
    applyFilters({
      selectedValues: selected,
      page: 1
    })
    setActiveFilters()
    handleScroll()
  }

  const onClears = () => {
    applyFilters({
      selectedValues: {},
      page: 1,
      type: 'init'
    })
    setActiveFilters()
  }

  return (
    <Fragment>
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 h-full w-[calc(100%-56px)] max-w-[320px] pb-4 -translate-x-full bg-white transition-transform ${
          activeFilters ? '!translate-x-[0]' : ''
        }`}
      >
        <div className="relative px-5">
          <div className="flex items-center justify-between py-5 border-b">
            <button onClick={handleClose} aria-label="close filter" className={`absolute -right-12 top-2 ${activeFilters ? 'visible' : 'invisible'}`}>
              <Icon name="icon-close-circle-outline" viewBox="0 0 40 40" className="w-10 h-10 text-white" />
            </button>
            <div className="mr-3 text-base font-bold font-body text-grey-900">Filtering by:</div>
            {!isEmpty(selectedValues) && values && values.length &&
              <button type="button" className="text-sm font-normal underline link text-grey-600" onClick={() => onClears()}>
                {translate.collection.clearSelections}
              </button>
            }
          </div>
        </div>
        {filters.length ? (
          !isLoading ? (
            <Fragment>
              <PlpFilterPanel
                className="h-[calc(100%-130px)] overflow-y-auto px-5 js-plp-filter-slideout-content"
                isMobile={isMobile}
                filters={filters}
                activeFilters={activeFilters}
                selectedValues={selectedValues}
                localSelectedValues={setSelected}
                isSlideout={true}
              />
              <PlpFilterApply handleApply={handleApply} />
            </Fragment>
          ) : (
            <PlpFilterSkeleton />
          )
        ) : (
          <div className="p-6">{translate.collection.noOptionFilter}</div>
        )}
      </div>
      {activeFilters && <div className="fixed top-0 left-0 z-30 w-full h-full bg-overlay" onClick={handleClose}></div>}
    </Fragment>
  )
}

export default PlpFilterSlideout
