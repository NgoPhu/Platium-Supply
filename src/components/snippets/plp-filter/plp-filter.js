import { Fragment } from 'preact'
import PlpFilterSidebar from 'snippets/plp-filter-sidebar/plp-filter-sidebar'
import PlpFilterSlideout from 'snippets/plp-filter-slideout/plp-filter-slideout'
import PlpBanner from 'snippets/plp-banner/plp-banner'

function PlpFilter({ isMobile, isLoading, filters, activeFilters, selectedValues, setActiveFilters, applyFilters, merchandising }) {
  return (
    <Fragment>
      {isMobile ? (
        <PlpFilterSlideout
          isMobile={isMobile}
          isLoading={isLoading}
          filters={filters}
          activeFilters={activeFilters}
          selectedValues={selectedValues}
          setActiveFilters={setActiveFilters}
          applyFilters={applyFilters}
        />
      ) : (
        <Fragment>
          <PlpFilterSidebar
            className="border-default md:border-b md:px-6 lg:border-b-0 lg:px-0"
            isMobile={isMobile}
            isLoading={isLoading}
            filters={filters}
            selectedValues={selectedValues}
            applyFilters={applyFilters}
          />
          {merchandising && merchandising.left && <PlpBanner banners={merchandising.left} className="mt-4 px-8" classItem="mb-3" />}
        </Fragment>
      )}
    </Fragment>
  )
}

export default PlpFilter
