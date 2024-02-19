import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import { selectAll, addClass, removeClass, on } from 'helpers/dom'
import Icon from 'snippets/icon/icon'
import debounce from 'lodash.debounce'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

const selectors = {
  ITEM_ACTIVE_CLASS: 'carousel-dots-item-active',
  BUTTON_DISABLED_CLASS: 'carousel-button-disable',
  TIME_DEBOUNCE: 50
}

function CarouselCustom({ content, classWrap, showDots = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const carouselTrackRef = useRef(null)
  const prevButtonRef = useRef(null)
  const nextButtonRef = useRef(null)
  const [items, setItems] = useState([])
  const [rate, setRate] = useState(0)
  const [gapViewport, setGapViewport] = useState(0)
  const [offscreenWidth, setOffscreenWidth] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(0)
  const [slidesCount, setSlidesCount] = useState(0)
  const [drag, setDrag] = useState({
    press: false,
    startX: 0,
    scrollLeft: 0
  })
  const [isShowNavigation, setIsShowNavigation] = useState(true)

  const maxIndex = useMemo(() => getMaxIndex(items, offscreenWidth), [offscreenWidth, items])

  function getGapViewport(el) {
    const computedStyle = getComputedStyle(el)

    return parseFloat(computedStyle.paddingLeft) > 0 ? parseFloat(computedStyle.paddingLeft) : el.getBoundingClientRect().left
  }

  function getOffsetWidth(el) {
    return el.getBoundingClientRect().width
  }

  function getOffScreen(items, totalWidth) {
    return getOffsetWidth(items[0]) * items.length - totalWidth
  }

  function getRateChild(items, totalWidth) {
    return getOffsetWidth(items[0]) / totalWidth
  }

  function getOffsetLeft(el) {
    return el.getClientRects()[0].x - gapViewport
  }

  function getMaxIndex(items, offscreen) {
    let count = 0

    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      if ((getOffsetLeft(item) <= offscreen + getOffsetWidth(item) && rate === 1) || (rate < 1 && getOffsetLeft(item) < offscreen + getOffsetWidth(item))) {
        count++
      }
    }

    return count
  }

  const init = () => {
    const itemEls = selectAll('.carousel-item', carouselTrackRef.current)
    if (itemEls) {
      setItems(itemEls)
      setSlidesCount(itemEls.length)
    }
    const currentRate = getRateChild(itemEls, getOffsetWidth(carouselTrackRef.current.parentElement))
    if (currentRate) {
      setRate(currentRate)
      setSlidesPerView(1 / currentRate)
    }
    const offscreenWidth = getOffScreen(itemEls, getOffsetWidth(carouselTrackRef.current.parentElement))
    if (offscreenWidth) {
      setOffscreenWidth(offscreenWidth)
    }
    setGapViewport(getGapViewport(carouselTrackRef.current))
  }

  const scroll = (index) => {
    const item = items[index]
    if (item) {
      carouselTrackRef.current.scrollTo(item.offsetLeft, 0)
    }
  }

  function onScroll() {
    const carouselItemWidth = carouselTrackRef.current.firstChild.offsetWidth
    on(
      'scroll',
      debounce(() => {
        const scrollIndex = Math.ceil(carouselTrackRef.current.scrollLeft / carouselItemWidth)
        setCurrentIndex(Number(scrollIndex))
      }, selectors.TIME_DEBOUNCE),
      carouselTrackRef.current
    )
  }

  const handleNext = () => setIndex(1)

  const handlePrev = () => setIndex(-1)

  const setIndex = (t) => {
    const s = currentIndex + t
    if (s < 0) {
      setCurrentIndex(0)
    } else {
      if (s >= maxIndex) {
        setCurrentIndex(maxIndex - 1)
      } else {
        setCurrentIndex(s)
      }
    }
    if (isShowNavigation) {
      updateNavigation(s)
    }
  }

  function updateNavigation(index) {
    if (index <= 0) {
      addClass(selectors.BUTTON_DISABLED_CLASS, prevButtonRef.current)
    } else {
      removeClass(selectors.BUTTON_DISABLED_CLASS, prevButtonRef.current)
    }
    if (index >= maxIndex - 1) {
      addClass(selectors.BUTTON_DISABLED_CLASS, nextButtonRef.current)
    } else {
      removeClass(selectors.BUTTON_DISABLED_CLASS, nextButtonRef.current)
    }
  }

  function onMouseDown(e) {
    drag.press = true
    drag.startX = e.pageX - carouselTrackRef.current.offsetLeft
    drag.scrollLeft = carouselTrackRef.current.scrollLeft
  }

  function onMouseUp() {
    drag.press = false
    removeClass('on-drag', carouselTrackRef.current)
  }

  function onMouseMove(e) {
    if (drag.press) {
      if (!carouselTrackRef.current.classList.contains('on-drag')) {
        addClass('on-drag', carouselTrackRef.current)
      }
      const delta = drag.startX - e.pageX

      carouselTrackRef.current.scrollLeft = drag.scrollLeft + delta
    }
  }

  function onTouchStart(e) {
    drag.press = true
    drag.startX = e.touches[0].pageX - carouselTrackRef.current.offsetLeft
    drag.scrollLeft = carouselTrackRef.current.scrollLeft
  }

  function onTouchMove(e) {
    if (drag.press) {
      if (!carouselTrackRef.current.classList.contains('on-drag')) {
        addClass('on-drag', carouselTrackRef.current)
      }
      const delta = drag.startX - e.touches[0].pageX

      carouselTrackRef.current.scrollLeft = drag.scrollLeft + delta
    }
  }

  function onTouchEnd() {
    drag.press = false
    removeClass('on-drag', carouselTrackRef.current)
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    onScroll()
  }, [carouselTrackRef.current])

  useEffect(() => {
    scroll(currentIndex)
  }, [currentIndex])

  useEffect(() => {
    if (isShowNavigation) {
      updateNavigation(currentIndex)
    }
  }, [currentIndex, maxIndex])

  useEffect(() => {
    if (slidesCount === slidesPerView) {
      showDots = false
      setIsShowNavigation(false)
    } else {
      setIsShowNavigation(true)
      showDots = true
    }
  }, [slidesCount, slidesPerView])

  return (
    <div className={`carousel-wrap ${classWrap}`} ref={carouselRef}>
      <div className="carousel-inner">
        <div className="carousel relative">
          <div
            className="carousel-track carousel-enable carousel-grid relative flex scroll-smooth"
            ref={carouselTrackRef}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
          >
            {content}
          </div>
          {isShowNavigation && (
            <div className="carousel-buttons -top-[50px] right-4 md:-top-[70px] lg:right-8">
              <button
                className="carousel-button carousel-button-prev"
                aria-label="back"
                data-direction="prev"
                type="button"
                onClick={handlePrev}
                ref={prevButtonRef}
              >
                <Icon name="icon-chevron-left" className="carousel-icon" viewBox="0 0 24 24" />
              </button>
              <button
                className="carousel-button carousel-button-next"
                aria-label="forward"
                data-direction="next"
                type="button"
                onClick={handleNext}
                ref={nextButtonRef}
              >
                <Icon name="icon-chevron-right" className="carousel-icon" viewBox="0 0 24 24" />
              </button>
            </div>
          )}
          {showDots && maxIndex > 1 && (
            <div class="carousel-dots flex items-center justify-center">
              {[...Array(maxIndex)].map((_, index) => (
                <div className={`carousel-dots-item ${index === currentIndex ? selectors.ITEM_ACTIVE_CLASS : ''}`} onClick={() => setCurrentIndex(index)}></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CarouselCustom
