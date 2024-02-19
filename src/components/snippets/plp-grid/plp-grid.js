import { Fragment } from 'preact'
import { intellisuggestTrackClick } from 'uses/useSearchspringTracking'
import { getImages, getAvailable, getVariants, getOptions, getTags, getPrice, checkItemInCart } from 'uses/useSearchspringUtils'
import { getProductTitle } from 'uses/useShopify'
import PlpCard from 'snippets/plp-card/plp-card'
import PlpInlineBanner from 'snippets/plp-inline-banner/plp-inline-banner'

function PlpGrid({ isLoading, products, handle }) {
  return (
    <div class="grid grid-cols-2 divide-default sm:grid-cols-3 xl:grid-cols-4">
      {products &&
        products.length > 0 &&
        products.map((product) =>
          product.handle ? (
            <PlpCard
              title={getProductTitle(product.title)}
              subtitle={product.title}
              url={product.url}
              handle={product.handle}
              imageUrl={getImages(product.image, product.thumbnailImageUrl)}
              secondImageUrl={product.images}
              available={getAvailable(product.ss_available)}
              variants={getVariants(product.variants)}
              options={getOptions(product.options)}
              tags={getTags(product.tags)}
              price={getPrice(product.price)}
              originalPrice={getPrice(product.msrp)}
              intellisuggestData={product.intellisuggestData}
              intellisuggestSignature={product.intellisuggestSignature}
              isInCart={checkItemInCart(product.uid)}
              collectionClickTracking={intellisuggestTrackClick}
              collectionHandle={handle}
            />
          ) : (
            <PlpInlineBanner
              className="plp-card-banner plp-card relative flex flex-col border-b border-r border-default lg:relative lg:overflow-hidden"
              index={product.config.position.index}
              key={product.key}
              content={product.value}
            />
          )
        )}
      {!isLoading && products && products.length === 0 ? (
        <div className="p-6">
          <span>{translate.collection.noProducts}</span>
        </div>
      ) : null}
      {isLoading ? <PlpGridSkeleton /> : null}
    </div>
  )
}

function PlpGridSkeleton() {
  return (
    <Fragment>
      {[...Array(24)].map(() => (
        <div class="plp-card flex animate-pulse flex-col content-center border-b border-default p-3 lg:relative lg:overflow-hidden lg:p-4">
          <div class="relative mb-2 md:mb-4">
            <div className="aspect-square relative w-full bg-grey-400 pb-[100%]"></div>
          </div>
          <div class="mb-3 flex-1 text-center">
            <div className="mx-auto h-10 w-2/3 bg-grey-400"></div>
          </div>
          <div class="flex flex-col">
            <div className="mx-auto mb-2 h-6 w-1/3 bg-grey-400"></div>
            <div className="mx-auto mt-3 h-7 w-1/2 bg-grey-400"></div>
            <div className="mt-4 h-12 w-full bg-grey-400"></div>
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default PlpGrid
