import Icon from 'snippets/icon/icon'
import PlpSort from 'snippets/plp-sort/plp-sort'
import { getSelectedValues } from 'uses/useSearchspringUtils'

const selectors = {
  priceKey: 'filter.v.price'
}

function PlpFilterBar({ isMobile, isLoading, pagination, activeFilters, sortOrder, sortOptions, setActiveFilters, applySort, selectedValues, toggleLayout, isSearchPage, layout }) {
  const { title, searchTitle } = window.plpState

  return (
    <div className="lg:flex lg:justify-between">
      <div className="flex justify-between lg-max:hidden">
        <div className="">
          {!isLoading && pagination ? (
            <div className="flex items-baseline">
              <div className="mr-2 text-xl font-bold font-body text-grey-900 lg:text-2xl">{isSearchPage ? searchTitle : title}</div>
              <PlpFilterCount total={pagination.totalProducts} />
            </div>
          ) : <PlpFilterSkeleton className="w-[67px] pr-6" />}
        </div>
        <div className="lg:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => toggleLayout('grid')}><Icon name="icon-grid" className={`text-custom-1 ${layout === 'grid' ? 'text-secondary' : ''}`} /></button>
            <button onClick={() => toggleLayout('list')}><Icon name="icon-list" className={`text-custom-1 ${layout === 'list' ? 'text-secondary' : ''}`} /></button>
          </div>
        </div>
      </div>
      <div className="flex items-end mt-3 lg:mt-0 lg:gap-8 lg-max:sticky lg-max:top-32 lg-max:shadow-base">
        <div className="lg-max:flex-1 lg-max:border-2 lg-max:!border-r lg-max:flex-center lg-max:px-[18px] lg-max:py-3 lg-max:h-14 lg-max:bg-white lg-max:rounded-l-lg lg-max:[.is-plp-sticky_&]:!rounded-none lg-max:[.is-plp-sticky_&]:!border-l-0 lg-max:[.is-plp-sticky_&]:!border-t-0 lg-max:[.is-plp-sticky_&]:border">
          {isMobile && (
            <button className="flex items-center" onClick={setActiveFilters}>
              <Icon name="icon-filter" className="w-4 h-4 mr-2 text-secondary" viewBox="0 0 20 20" />
              <span className="text-sm font-semibold tracking-normal text-grey-900 font-body">
              {translate.collection.filters}
                {!isMobile &&
                  !isLoading &&
                  getSelectedValues(selectedValues, selectors.priceKey).length > 0 &&
                  `(${getSelectedValues(selectedValues, selectors.priceKey).length})`}
            </span>
            </button>
          )}
        </div>
        <div className="lg-max:flex-1 lg-max:border-2 lg-max:flex-center lg-max:px-[18px] lg-max:py-3 lg-max:h-14 lg-max:bg-white lg-max:rounded-r-lg lg-max:!border-l lg-max:[.is-plp-sticky_&]:!rounded-none lg-max:[.is-plp-sticky_&]:!border-r-0 lg-max:[.is-plp-sticky_&]:!border-t-0 lg-max:[.is-plp-sticky_&]:border lg-max:[.is-plp-sticky_&]:!border-l-0">
          {!isLoading && sortOptions.length ? (
            <PlpSort isMobile={isMobile} isLoading={isLoading} sortOrder={sortOrder} sortOptions={sortOptions} applySort={applySort} />
          ) : (
            <PlpFilterSkeleton className="w-[110px]" />
          )}
        </div>
        <div className="lg-max:hidden">
          <div className="flex items-center gap-2">
          <button onClick={() => toggleLayout('grid')}><Icon name="icon-grid" className={`text-custom-1 ${layout === 'grid' ? 'text-secondary' : ''}`} /></button>
            <button onClick={() => toggleLayout('list')}><Icon name="icon-list" className={`text-custom-1 ${layout === 'list' ? 'text-secondary' : ''}`} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlpFilterCount({ total }) {
  return (
    <div className="text-sm tracking-normal">
      <span className="text-secondary">{total}</span>
      <span className="text-grey-900">{`${total > 1 ? ' items' : ' item'}`}</span>
    </div>
  )
}

function PlpFilterSkeleton({ className }) {
  return (
    <div className={className}>
      <div className="h-[22px] w-full animate-pulse bg-grey-400"></div>
    </div>
  )
}

export { PlpFilterBar, PlpFilterCount, PlpFilterSkeleton }
