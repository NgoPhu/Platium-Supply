import './carousel-swiper.css'
import { getData } from 'helpers/dom'
import SwiperInstance from 'uses/useSwiper'

class CarouselSwiperCustom extends HTMLElement {
  constructor() {
    super()

    const config = JSON.parse(getData('config', this))
    const options = JSON.parse(getData('options', this))
    const carousel = new SwiperInstance(this, options, config)
  }
}

customElements.define('carousel-swiper-custom', CarouselSwiperCustom)
