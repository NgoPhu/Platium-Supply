import register from 'preact-custom-element'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getRecentlyProducts, setRecentlyProductsData } from 'uses/useRecentlyProduct'
import { elInViewPort } from 'helpers/dom'
import { fetchData } from 'helpers/global'
import PlpCard from 'snippets/plp-card/plp-card'
import CarouselSwiper from 'modules/carousel-swiper/carousel-swiper'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import throttle from 'lodash.throttle'

function ProductRecently({ handle, heading }) {
  const elRef = useRef(null)
  const [products, setProducts] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const templateName = GM_STATE.shopify.templateName

  const recentlyHandles = getRecentlyProducts().filter((i) => i !== handle)

  const fetchProducts = async (handles) => {
    const allFetchs = handles.map((handle) => {
      return fetchData(`/products/${handle}?view=ajax`).then((product) => {
        return product
      })
    })
    return Promise.all(allFetchs).then((results) => results)
  }

  const init = async (handles) => {
    if (handles.length) {
      setIsFetching(true)
      const products = await fetchProducts(handles)
      const dataProducts = products.filter((product) => product)
      if (dataProducts.length) {
        setProducts(dataProducts)
        const data = dataProducts.map((item) => {
          return (
            item && {
              sku: item.initVariant.sku || ''
            }
          )
        })
        if (data) {
          setRecentlyProductsData(JSON.stringify(data))
        }
      }
      setIsFetching(false)
    } else {
      setIsFetching(false)
    }
  }

  const handleInit = () => {
    if (elInViewPort(elRef.current)) {
      init(recentlyHandles)
      window.removeEventListener('scroll', onInit)
    }
  }

  const onInit = throttle(handleInit, 500)

  useEffect(() => {
    if (recentlyHandles.length > 0) {
      window.addEventListener('scroll', onInit)
    }
  }, [])

  const sliderOptions = {
    slidesPerView: 2,
    spaceBetween: 16,
    scrollbar: {
      el: '.carousel-products-recently .swiper-scrollbar',
      draggable: true
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 32
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 42
      }
    }
  }

  return (
    recentlyHandles.length > 0 && (
      <div className={`relative container bg-grey-100 pt-8 md:pt-[72px] ${templateName === 'index' && '!pt-0 pb-8 md:pb-[72px]'}`} ref={elRef}>
        {!isFetching ? (
          products.length > 0 && (
            <div className="flex flex-col">
              {heading && (
                <h3 className="text-xl font-bold font-body mb-[26px] py-1 md:text-2xl md:mb-11">{heading}</h3>
              )}

              <div className="carousel-products-recently">
                <CarouselSwiper items={<ProductRecentlyItems products={products} />} options={sliderOptions} navigation={true} />
              </div>
            </div>
          )
        ) : (
          <LoaderSpin width="8" height="8" wrapperClass="bg-grey-100" />
        )}
      </div>
    )
  )
}

function ProductRecentlyItems({ products }) {
  const combineVariant = (variants, variantsData) => variants.map((variant) => {
    return {
      ...variant,
      ...variantsData[variant.id]
    }
  })

  return products.map(
    (product) =>
      product && (
        <swiper-slide>
          <PlpCard
            title={product.title}
            handle={product.handle}
            imageUrl={product.featuredImage}
            secondImageUrl={product.images}
            variants={combineVariant(product.variants, product.variants_data)}
            tags={product.tags}
            media={product.productMedia}
          />
        </swiper-slide>
      )
  )
}

register(ProductRecently, 'product-recently', ['heading', 'handle'])
