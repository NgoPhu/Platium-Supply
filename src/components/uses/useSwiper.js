import { select } from 'helpers/dom'

const selectors = {
  swiperClass: '.js-carousel-swiper',
  prevClass: '.js-carousel-prev',
  nextClass: '.js-carousel-next',
  paginationClass: '.js-carousel-pagination',
  scrollbarClass: '.js-carousel-scrollbar'
}

class SwiperInstance {
  constructor(element, options, config) {
    this.element = element
    this.setOptions(options || {}, config)
    this.initCarousel()
  }

  setOptions(options, config) {
    const { navigation, pagination, scrollbar } = options || {}

    const navEl = {
      prevEl: select(selectors.prevClass, this.element),
      nextEl: select(selectors.nextClass, this.element)
    }

    const paginationEl = select(selectors.paginationClass, this.element)

    const scrollbarEl = select(selectors.scrollbarClass, this.element)

    let optionThumbnail = {}
    if (config.thumbnail) {
      const thumbnailEl = select(config.thumbnail)
      optionThumbnail = {
        thumbs: {
          swiper: thumbnailEl
        }
      }
    }

    this.options = {
      ...options,
      navigation: config.navigation && { ...navigation, ...navEl },
      pagination: config.pagination && { ...pagination, el: paginationEl },
      scrollbar: config.scrollbar && { ...scrollbar, el: scrollbarEl },
      ...optionThumbnail,
      injectStylesUrls: ['/assets/module-carousel-swiper.css']
    }
  }

  initCarousel() {
    const swiperEl = select(selectors.swiperClass, this.element)
    if (swiperEl) {
      setTimeout(() => {
        Object.assign(swiperEl, this.options)
        swiperEl.initialize()
      }, 200)
    }
  }
}

export default SwiperInstance
