import register from 'preact-custom-element'
import throttle from 'lodash.throttle'
import SearchSpringService from 'uses/useSearchspring'
import { Fragment } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getRecentlyProductsData } from 'uses/useRecentlyProduct'
import { getVariants, getOptions, getTags, getPrice, getImages, getCartSkus } from 'uses/useSearchspringUtils'
import { postBeaconTracking, beaconProfileProduct, generateBeacon, generateBeaconProducts } from 'uses/useSearchspringTracking'
import { elInViewPort } from 'helpers/dom'
import { getProductTitle } from 'uses/useShopify'
import PlpCard from 'snippets/plp-card/plp-card'
import CarouseCustom from 'snippets/carousel-custom/carousel-custom'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'

function ProductRelated({ sku, heading, profile, borders, disabled }) {
  const { isMobile } = useDetectBreakpoint()
  const elRef = useRef(null)
  const [products, setProducts] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [isFetchingFalse, setIsFetchingFalse] = useState(false)
  const [isDisableMobile] = useState(JSON.parse(disabled))
  const [hasBorderBottom] = useState(JSON.parse(borders))
  const [skus] = useState(getCartSkus(window.GM_STATE.cart.initCart.items))

  const SearchSpringInstance = new SearchSpringService({
    siteId: GM_STATE.integrations.searchSpringConfig.siteId,
    enable: GM_STATE.integrations.searchSpringConfig.enable
  })

  const recentlyProductsData = getRecentlyProductsData()

  const getPayload = () => {
    const payload = {
      productId: sku || '',
      tags: profile,
      limits: 12
    }

    if (window.GM_STATE.customer.logged && window.GM_STATE.customer.id) {
      payload.shopper = window.GM_STATE.customer.id
    }

    if (window.GM_STATE.cart.initCart.items.length) {
      payload.cart = skus
    }

    if (recentlyProductsData && recentlyProductsData.length) {
      payload.lastViewed = getCartSkus(recentlyProductsData)
    }

    return payload
  }

  const init = async (payload) => {
    setIsFetching(true)
    try {
      const data = await SearchSpringInstance.getRecommended(payload)
      if (data[0].results && data[0].results.length) {
        setProducts(data[0].results)
        setTimeout(() => {
          initTracking()
        }, 500)
      }
      setIsFetching(false)
    } catch (error) {
      setIsFetching(false)
      setIsFetchingFalse(true)
    }
  }

  const handleBeaconProfile = () => {
    const arrs = [...generateBeacon(skus, profile, 'profile.render'), ...generateBeaconProducts(products, skus, profile, 'profile.product.render')]
    postBeaconTracking(arrs)
  }

  const handleBeaconProfileImpression = () => {
    const arrs = [...generateBeacon(skus, profile, 'profile.impression'), ...generateBeaconProducts(products, skus, profile, 'profile.product.impression')]
    postBeaconTracking(arrs)
  }

  const handleTrackingRender = () => {
    if (isFetchingFalse) {
      return
    }
    handleBeaconProfile()
  }

  const handleTrackingImpression = () => {
    if (isFetchingFalse) {
      window.removeEventListener('scroll', onTrackingImpression)
      return
    }
    if (elInViewPort(elRef.current, true)) {
      handleBeaconProfileImpression()
      window.removeEventListener('scroll', onTrackingImpression)
    }
  }

  const onTrackingImpression = throttle(handleTrackingImpression, 500)

  const initTracking = () => {
    window.addEventListener('scroll', handleTrackingRender, { once: true })
    window.addEventListener('scroll', onTrackingImpression)
  }

  useEffect(() => {
    init(getPayload())
  }, [])

  return (
    !isFetchingFalse &&
    products.length > 0 && (
      <div className={`relative border-t ${hasBorderBottom && 'border-b'}`} ref={elRef}>
        {!isFetching ? (
          <div className="flex flex-col">
            {heading && (
              <div className="container">
                <h3 className="z-[1] py-4 text-xl font-bold text-grey-900 md:py-8 lg:text-3xl">{heading}</h3>
              </div>
            )}
            <Fragment>
              {isMobile && isDisableMobile ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <ProductRelatedItems products={products} profile={profile} cardClass="w-full border-t" />
                </div>
              ) : (
                <CarouseCustom classWrap="border-t" content={<ProductRelatedItems products={products} cardClass="w-1/2 sm:w-1/3 lg:w-1/4 snap-start" />} />
              )}
            </Fragment>
          </div>
        ) : (
          <div className="flex py-14">
            <div className="container">
              <LoaderSpin width="8" height="8" />
            </div>
          </div>
        )}
      </div>
    )
  )
}

function ProductRelatedItems({ products, cardClass, profile, skus }) {
  const handleBeaconClickTracking = (product) => {
    return beaconProfileProduct(product, profile, skus, 'profile.product.click')
  }

  return products.map((product) => (
    <PlpCard
      className={`flex flex-col border-r p-4 lg:pb-8 ${cardClass} carousel-item flex-shrink-0 border-default lg:relative lg:overflow-hidden`}
      handle={product.attributes.handle}
      title={getProductTitle(product.mappings.core.name)}
      subtitle={product.mappings.core.name}
      url={product.mappings.core.url}
      imageUrl={getImages(product.mappings.core.imageUrl, product.mappings.core.thumbnailImageUrl)}
      alt={product.attributes.title}
      secondImageUrl={product.attributes.images}
      available={true}
      variants={getVariants(product.attributes.variants)}
      options={getOptions(product.attributes.options)}
      tags={getTags(product.attributes.tags)}
      price={getPrice(product.mappings.core.price)}
      originalPrice={getPrice(product.mappings.core.msrp)}
      beaconClickTracking={handleBeaconClickTracking(product)}
    />
  ))
}

if (!customElements.get('product-related')) {
  register(ProductRelated, 'product-related', ['handle', 'heading', 'borders', 'disabled'])
}
