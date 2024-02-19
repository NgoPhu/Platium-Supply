import PlpFilterPanel from 'snippets/plp-filter-panel/plp-filter-panel'
import PlpFilterSkeleton from 'snippets/plp-filter-skeleton/plp-filter-skeleton'
import { select, getTopOffset, getHeight } from 'helpers/dom'

const selectors = {
  plpFilterBar: '.js-plp-filter-bar',
  siteHeader: '#shopify-section-site-header'
}

function PlpFilterSidebar({ isMobile, isLoading, filters, selectedValues, applyFilters }) {
  const onClick = () => {
    const plpFilterBarEl = select(selectors.plpFilterBar)
    const siteHeaderEl = select(selectors.siteHeader)
    if (!plpFilterBarEl) return
    const offset = getTopOffset(plpFilterBarEl) - getHeight(siteHeaderEl)
    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    })
  }

  return !isLoading ? (
    filters.length ? (
      <div className="">
        <PlpFilterPanel isMobile={isMobile} filters={filters} selectedValues={selectedValues} applyFilters={applyFilters} onClick={onClick} />
      </div>
    ) : (
      <div className="p-6">
        <span>{translate.collection.noOptionFilter}</span>
      </div>
    )
  ) : (
    <PlpFilterSkeleton />
  )
}

export default PlpFilterSidebar
