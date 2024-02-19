import { Fragment } from 'preact'
import { useEffect, useMemo, useRef } from 'preact/hooks'
import { handleize } from 'helpers/dom'
import { getImages, getAvailable, getVariants, getOptions, getTags, getPrice, checkItemInCart } from 'uses/useSearchspringUtils'
import PlpCard from 'snippets/plp-card/plp-card'
import { SkeletonLine, SkeletonProduct } from 'snippets/skeleton/skeleton'
import { disableBodyScroll } from 'body-scroll-lock'
import { getProductTitle } from 'uses/useShopify'

const selectors = {
  maxSuggestions: 3,
  maxSuggestionsCollections: 5
}

function SearchDropdown({ state, closeSearch }) {
  const isLoading = useMemo(() => state.isLoading.value, [state.isLoading.value])
  const isOpenDropdown = useMemo(() => state.isOpenDropdown.value, [state.isOpenDropdown.value])
  const originalQuery = useMemo(() => state.originalQuery.value, [state.originalQuery.value])
  const correctedQuery = useMemo(() => state.correctedQuery.value, [state.correctedQuery.value])
  const searchValue = useMemo(() => state.searchValue.value, [state.searchValue.value])
  const suggestions = useMemo(() => state.suggestions.value, [state.suggestions.value])
  const collections = useMemo(() => state.collections.value, [state.collections.value])
  const redirectUrl = useMemo(() => state.redirectUrl.value, [state.redirectUrl.value])
  const totalResults = useMemo(() => state.totalResults.value, [state.totalResults.value])
  const pages = [] // theme settings
  const results = useMemo(() => state.results.value, [state.results.value])
  const { labelSuggestions, labelCollections, labelPages, textAllResults, textNoResult } = window.GM_STATE.integrations.searchSpringConfig
  const searchDropdownRef = useRef()
  const { searchSpringConfig } = window.GM_STATE.integrations

  useEffect(() => {
    if (isOpenDropdown) {
      disableBodyScroll(searchDropdownRef.current)
    }
  }, [isOpenDropdown])

  const generateCollectionUrl = (handle) => {
    return `/collections/${handleize(handle)}`
  }

  const handleViewAll = () => {
    let newUrl = `/search?q=${searchValue}`
    if (correctedQuery && correctedQuery !== searchValue) {
      newUrl = `/search?q=${correctedQuery}&oq=${searchValue}&spell=1`
    }
    return newUrl
  }

  const suggestionsCollections = () => {
    const collectionFilters = searchSpringConfig.collectionFilters ? searchSpringConfig.collectionFilters.split('|') : []
    return collections.filter((value) => collectionFilters.includes(handleize(value.value)))
  }

  const collectionData = suggestionsCollections() && suggestionsCollections().length > 0 ? suggestionsCollections() : collections

  return (
    <Fragment>
      <div
        ref={searchDropdownRef}
        className="js-search-dropdown z-20 max-h-full w-full overflow-y-auto border-t border-default bg-white px-4 py-6 md:fixed md:top-[calc(var(--header-offset-top)_+_72px)] md:left-0 md:flex md:p-0 [.is-sticky_&]:xl:!top-[calc(var(--header-offset-top)_+_133px)]"
      >
        {isLoading || (correctedQuery && correctedQuery !== searchValue) || (suggestions && suggestions.length > 0) || (pages && pages.length) ? (
          <div className="mb-6 border-b border-default pb-6 md:mb-0 md:w-[278px] md:border-0 md:border-r md:p-8">
            {correctedQuery && correctedQuery !== searchValue && (
              <div className="">
                <h3 className="">{translate.search.didYouMean}</h3>
                {isLoading ? (
                  <div className="skeleton skeleton--line skeleton--w-140" />
                ) : (
                  <div className="">
                    <span className="" onClick="state.selectSuggestion(correctedQuery)">
                      {correctedQuery}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="text-left">
              {((suggestions && suggestions.length > 0) || isLoading) && <h3 className="mb-2 text-sm font-bold uppercase text-grey-900">{labelSuggestions}</h3>}
              {isLoading && <div className="w-28">{SkeletonLine(selectors.maxSuggestions)}</div>}
              {suggestions && suggestions.length && !isLoading ? (
                <div className="flex flex-col gap-2">
                  {suggestions.map(
                    (item) =>
                      item.text.toLowerCase() !== searchValue.toLowerCase() && (
                        <a className="text-sm text-grey-900 no-underline hover:text-secondary-hover" href={`/search?q=${item.text}`}>
                          {item.text}
                        </a>
                      )
                  )}
                </div>
              ) : null}
            </div>
            {((collectionData && collectionData.length) || isLoading) && (
              <div className="mt-6 text-left">
                <h3 className="mb-2 text-sm font-bold uppercase text-grey-900">{labelCollections}</h3>
                {isLoading ? (
                  <div className="w-28">{SkeletonLine(selectors.maxSuggestionsCollections)}</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {collectionData.map((page) => (
                      <a target="_blank" href={generateCollectionUrl(page.value)} className="text-sm text-grey-900 hover:text-secondary-hover">
                        {page.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            {pages && pages.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-sm font-bold uppercase text-grey-900">{labelPages}</h3>
                {isLoading && <div className="w-28">{SkeletonLine(pages.length)}</div>}
                {pages && pages.length && !isLoading ? (
                  <div className="flex flex-col gap-2">
                    {pages.map((item) => (
                      <a href={item.url} className="text-sm text-grey-900">
                        {item.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
        <div className="md:flex-1">
          {isLoading ? (
            <div className="md:px-8 md:py-6">
              <div className="mb-2 w-28 md:mb-4">{SkeletonLine()}</div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 3xl:gap-8">{SkeletonProduct(6)}</div>
            </div>
          ) : (
            <div className="md:px-8 md:py-6">
              {totalResults > 0 && (
                <a className="link mb-2 block text-left normal-case md:mb-4" href={handleViewAll()}>
                  {textAllResults} ({totalResults})
                </a>
              )}
              {results && results.length && !isLoading ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 3xl:gap-8">
                  {results.map((product) => (
                    <PlpCard
                      className="plp-card-search relative flex flex-col"
                      title={getProductTitle(product.title)}
                      subtitle={product.title}
                      url={product.url}
                      imageUrl={getImages(product.image, product.thumbnailImageUrl)}
                      secondImageUrl={product.images}
                      available={getAvailable(product.ss_available)}
                      variants={getVariants(product.variants)}
                      options={getOptions(product.options)}
                      tags={getTags(product.tags)}
                      price={getPrice(product.price)}
                      originalPrice={getPrice(product.msrp)}
                      isInCart={checkItemInCart(product.uid)}
                      inSuggestion={true}
                      showQuickAdd={false}
                      handle={product.handle}
                    />
                  ))}
                </div>
              ) : (
                <div className="">
                  {correctedQuery ? (
                    <p>
                      {translate.search.didYouMean} <a href={`/search?q=${correctedQuery}&oq=${originalQuery}&results=0`}>{correctedQuery}</a>?
                    </p>
                  ) : (
                    <p className="mb-2">{textNoResult}</p>
                  )}
                  {redirectUrl && (
                    <p>
                      {translate.search.suggestionForSearch}:
                      <a href={redirectUrl}>{originalQuery}</a>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className="fixed top-[calc(var(--header-offset-top)_+_56px)] left-0 h-full w-full bg-overlay md:top-[calc(var(--header-offset-top)_+_72px)] [.is-sticky_&]:xl:!top-[calc(var(--header-offset-top)_+_133px)]"
        onClick={closeSearch}
      ></div>
    </Fragment>
  )
}

export default SearchDropdown
