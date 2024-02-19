import { Fragment } from 'preact'
import { getImages, groupParamsByKey } from 'uses/useCollectionNativeUtils'
import PlpCard from 'snippets/plp-card/plp-card'
import { useMemo } from 'preact/hooks'

function PlpGridOrigin({ isLoading, products, handle, layout }) {
  const emptyText = useMemo(() => {
    const paramsString = window.location.href.split('?')[1]
    const isSearchPage = window.location.pathname === '/search'
    const paramsDefault = groupParamsByKey(new URLSearchParams(paramsString))

    if (isSearchPage) {
      return translate.collection.noResults.replace('{{ terms }}', paramsDefault.searchQuery)
    }
    return translate.collection.noProducts
  }, [])

  return (
    <div className={`${layout === 'grid' ? 'grid grid-cols-2 divide-default gap-x-4 gap-y-7 mt-6 lg:mt-8 lg:gap-x-6 lg:gap-y-12 lg:grid-cols-4' : 'mt-6 [&+.plp-pagination]:mt-0 lg:mt-8'}`}>
      {!isLoading && products
        ? (products.length > 0 ? (
            products.map((product) =>
              <PlpCard
                title={product.title}
                description={product.description}
                handle={product.handle}
                imageUrl={getImages(product.featuredImage)}
                secondImageUrl={product.images}
                variants={product.variants}
                optionsWithValues={product.options_with_values}
                onlyDefaultVariant={product.has_only_default_variant}
                tags={product.tags}
                collectionHandle={handle}
                className={layout === 'grid' ? 'plp-card-grid' : 'plp-card-list'}
              />
            )
          ) : (
            <span className="col-span-full">{emptyText}</span>
          )) : <PlpGridOriginSkeleton />
      }
    </div>
  )
}

function PlpGridOriginSkeleton() {
  return (
    <Fragment>
      {[...Array(12)].map(() => (
        <div class="flex flex-col animate-pulse lg:relative lg:overflow-hidden plp-card content-center">
          <div className="relative mb-4 lg:mb-6">
            <div className="aspect-square relative bg-grey-300 w-full pb-[100%]"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-[104px] h-7 bg-grey-300"></div>
            <div className="w-2/3 h-5 lg:h-[36px] mt-3 lg:mt-4 bg-grey-300"></div>
            <div className="w-full h-12 mt-2 bg-grey-300"></div>
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default PlpGridOrigin
