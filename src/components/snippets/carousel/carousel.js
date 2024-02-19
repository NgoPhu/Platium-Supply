import { CarouselInstance, CarouselThumbs } from 'uses/useCarousel'
import { eventProps } from 'helpers/global'

class CarouselMain extends HTMLElement {
  constructor() {
    super()

    const options = {
      loop: this.hasAttribute('data-loop'),
      autoplay: this.hasAttribute('data-autoplay') && this.getAttribute('data-autoplay'),
      watchHeight: this.hasAttribute('data-watch-height'),
      direction: this.getAttribute('data-direction'),
      asNavFor: this.getAttribute('data-as-nav-for')
    }
    if (options.asNavFor) {
      this.instance = new CarouselThumbs(this, options)
    } else {
      this.instance = new CarouselInstance(this, options)
    }

    globalEvents.on(eventProps.product.updateVariant, (variant) => {
      this.updateImage(variant)
    })
  }

  updateImage(variant) {
    const position = variant?.featured_image?.position - 1
    this.instance.setActiveSlide(position)
  }
}

customElements.define('carousel-main', CarouselMain)
