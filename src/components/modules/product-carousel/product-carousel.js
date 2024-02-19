import CarouselSwiper from 'modules/carousel-swiper/carousel-swiper'
import PlpCard from 'snippets/plp-card/plp-card'

function ProductCarousel ({ title, products }) {
  const combineVariant = (variants, variantsData) => variants.map((variant) => {
    return {
      ...variant,
      ...variantsData[variant.id]
    }
  })

  const sliderItems = () => {
    return (
      products.map(product => (
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
      ))
    )
  }

  const sliderOptions = {
    slidesPerView: 2,
    spaceBetween: 16,
    scrollbar: {
      el: '.carousel-featured-products .swiper-scrollbar',
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
    <div className="pb-8 container mt-2 md:mt-1 md:pb-[72px]">
      {title && <h2 className="text-xl font-bold font-body mb-[26px] md:text-2xl md:mb-11">{title}</h2>}
      {
        products && products.length > 0 &&
        <div className="carousel-featured-products">
          <CarouselSwiper items={sliderItems()} options={sliderOptions} navigation={true} scrollbar={true} />
        </div>
      }
    </div>
  )
}

export default ProductCarousel
