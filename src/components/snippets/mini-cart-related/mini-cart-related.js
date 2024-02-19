import SearchSpringService from 'uses/useSearchspring'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getRecentlyProductsData } from 'uses/useRecentlyProduct'
import { getVariants, getOptions, getTags, getPrice, getImages, getCartSkus } from 'uses/useSearchspringUtils'
import { beaconProfileProduct } from 'uses/useSearchspringTracking'
import { getProductTitle } from 'uses/useShopify'

import PlpCard from 'snippets/plp-card/plp-card'
import CarouseCustom from 'snippets/carousel-custom/carousel-custom'

function MiniCartRelated({ heading, profile, limits = 3 }) {
  const elRef = useRef(null)
  const [products, setProducts] = useState([])
  const [skus] = useState(getCartSkus(window.GM_STATE.cart.initCart.items))

  const SearchSpringInstance = new SearchSpringService({
    siteId: GM_STATE.integrations.searchSpringConfig.siteId,
    enable: GM_STATE.integrations.searchSpringConfig.enable
  })

  const recentlyProductsData = getRecentlyProductsData()

  const getPayload = () => {
    const payload = {
      productId: '',
      tags: profile,
      limits
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
    try {
      const data = await SearchSpringInstance.getRecommended(payload)
      if (data[0].results && data[0].results.length) {
        setProducts(data[0].results)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    init(getPayload())
  }, [])

  return (
    products.length > 0 && (
      <div className="relative border-t" ref={elRef}>
        <div className="flex flex-col">
          {heading && (
            <div className="px-4 md:px-6">
              <h3 className="z-10 py-4 text-lg font-bold text-grey-900 md:py-6">{heading}</h3>
            </div>
          )}
          <CarouseCustom
            showDots="true"
            classWrap="carousel-wrap-mini-cart"
            content={<ProductRelatedItems products={products} cardClass="plp-card-mini-cart snap-start" />}
          />
        </div>
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
      className={`carousel-item flex flex-shrink-0 flex-col border-r border-default p-4 lg:relative lg:overflow-hidden ${cardClass}`}
      handle={product.attributes.handle}
      title={getProductTitle(product.mappings.core.name)}
      url={product.mappings.core.url}
      imageUrl={getImages(product.mappings.core.imageUrl, product.mappings.core.thumbnailImageUrl)}
      available={true}
      variants={getVariants(product.attributes.variants)}
      options={getOptions(product.attributes.options)}
      tags={getTags(product.attributes.tags)}
      price={getPrice(product.mappings.core.price)}
      originalPrice={getPrice(product.mappings.core.msrp)}
      isMiniCart={true}
      beaconClickTracking={handleBeaconClickTracking(product)}
    />
  ))
}

export default MiniCartRelated
