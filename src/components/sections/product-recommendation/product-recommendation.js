import register from 'preact-custom-element'
import { useEffect, useState } from 'preact/hooks'
import PlpCard from 'snippets/plp-card/plp-card'
import CarouselSwiper from 'modules/carousel-swiper/carousel-swiper'

function ProductRecommendation({ id, title, limits = 12 }) {
  const productData = window.productRecommendation
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    return fetch(`/recommendations/products?product_id=${id}&limit=${limits}&section_id=product-recommendation-ajax`)
      .then(res => res.text())
      .then(text => {
        if (text) {
          const data = JSON.parse(text.replace(/(<([^>]+)>)/gi, '') || '[]')
          setProducts(data)
        }
      })
  }

  if (productData && productData.length > 0) {
    setProducts(productData)
  } else {
    useEffect(fetchProducts, [])
  }

  const sliderOptions = {
    slidesPerView: 2,
    spaceBetween: 16,
    scrollbar: {
      el: '.carousel-products-recommendation .swiper-scrollbar',
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
    products && products.length > 0 && (
      <div className="relative pb-8 bg-grey-100 md:pb-[72px]">
        <div class="container">
          <div className="flex flex-col">
            {title && (
              <h3 className="text-xl font-bold font-body mb-[26px] md:text-2xl md:mb-11">{title}</h3>
            )}

            <div className="carousel-products-recommendation">
              <CarouselSwiper items={<ProductRecommendationItem products={products} />} options={sliderOptions} navigation={true} />
            </div>
          </div>
        </div>
      </div>
    )
  )
}

function ProductRecommendationItem({ products }) {
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

register(ProductRecommendation, 'product-recommendation', ['id', 'title'])
