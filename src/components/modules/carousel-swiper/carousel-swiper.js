import { useEffect, useRef } from 'preact/hooks'
import SwiperInstance from 'uses/useSwiper'
import Icon from 'snippets/icon/icon'

export default function CarouselSwiper({ items, options, navigation = false, pagination = false, scrollbar = true }) {
  const config = { navigation, pagination, scrollbar }
  const swiperRef = useRef(null)

  useEffect(() => {
    const carousel = new SwiperInstance(swiperRef.current, options, config)
  }, [])

  return items && (
    <div ref={swiperRef} className="swiper-wrapper">
      <swiper-container
        className="js-carousel-swiper"
        init="false"
      >
        {items}
      </swiper-container>
      {navigation && <div class="swiper-navigation js-carousel-navigation">
        <div class="swiper-button swiper-button-prev js-carousel-prev">
          <Icon viewBox="0 0 16 16" name="icon-chevron-back-outline" className="w-4 h-4 text-secondary" />
        </div>
        <div class="swiper-button swiper-button-next js-carousel-next">
          <Icon viewBox="0 0 16 16" name="icon-chevron-forward-outline" className="w-4 h-4 text-secondary" />
        </div>
      </div>}
      {pagination && <div class="swiper-pagination js-carousel-pagination"></div>}
      {scrollbar && <div class="swiper-scrollbar js-carousel-scrollbar"></div>}
    </div>
  )
}
