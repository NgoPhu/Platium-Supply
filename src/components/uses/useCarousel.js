import { addClass, on, removeClass, select, selectAll } from 'helpers/dom'
import { map } from 'helpers/utils'

const selectors = {
  TRACK_SELECTOR: '.carousel-track',
  DOTS_SELECTOR: '.carousel-dots',
  NEXT_BUTTON_SELECTOR: 'button[data-direction="next"]',
  PREV_BUTTON_SELECTOR: 'button[data-direction="prev"]',
  BUTTON_DISABLED_CLASS: 'carousel-button-disable',
  ITEM_ACTIVE_CLASS: 'carousel-dots-item-active',
  DOT_ITEM_SELECTOR: '.carousel-dots-item',
  ITEM_SELECTOR: '.carousel-item',
  HIDDEN_CLASS: '!hidden',
  ITEM_CONTENT_SELECTOR: '.js-slider-content'
}

class CarouselInstance {
  constructor(element, options) {
    this.element = element
    this.track = select(selectors.TRACK_SELECTOR, this.element)
    this.dotsWrap = select(selectors.DOTS_SELECTOR, this.element)
    this.dots = null
    this.currentIndex = 0
    this.slidesCount = this.track.childElementCount
    this.maxIndex = this.track.childElementCount
    this.items = [...this.track.children]
    this.virtualItems = [...this.track.children]
    this.virtualIndex = 0
    this.slidesPerView = 0
    this.rate = 0
    this.gapViewport = 0
    this.drag = {
      press: false,
      startX: 0,
      startY: 0,
      scrollLeft: 0,
      scrollTop: 0,
      velX: 0,
      momentumID: null
    }

    this.events = {
      changeSlide: new CustomEvent('change-index', {
        detail: {
          index: this.currentIndex
        }
      })
    }

    this.options = options || {}

    this.scrollTimeout = null
    this.initOffsetLeft = 0
    this.initOffsetTop = 0
    this.autoplayInterval = null

    this.nextButton = select(selectors.NEXT_BUTTON_SELECTOR, this.element)
    this.previousButton = select(selectors.PREV_BUTTON_SELECTOR, this.element)
    this.onKeyup = this.onKeyup.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.onClickDots = this.onClickDots.bind(this)
    this.attachEventDrag = this.attachEventDrag.bind(this)

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.init = this.init.bind(this)

    this.init()
    this.initNavigation()
    this.attachEventDrag()

    const resizeObserver = new ResizeObserver((entries) => this.init())
    resizeObserver.observe(this.track)
    if (this.options.loop && (this.slidesCount > this.slidesPerView)) {
      this.duplicateSlides()
    } else {
      this.options.loop = false
    }
  }

  init() {
    if (this.track && this.track.children.length > 0) {
      const trackParentEl = this.track.parentElement
      this.rate = this.getRateChild(this.track.children)
      this.slidesPerView = Math.floor(1 / this.rate)
      if (this.options.loop) {
        this.maxIndex = this.slidesCount
      } else {
        this.maxIndex = this.slidesCount - this.slidesPerView + 1
      }
      const enable = this.checkEnable(this.track.children, this.getOffsetWidth(trackParentEl))
      if (enable) {
        this.initDots()
        this.attachEvent()
      } else {
        this.destroy()
      }
    } else if (this.track) {
      this.watchContent(this.track)
    }
  }

  attachEventDrag() {
    this.track.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.track.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.track.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.track.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.track.addEventListener('wheel', this.onMouseWheel.bind(this))
  }

  onMouseDown(e) {
    this.drag.press = true
    if (this.options.direction === 'vertical') {
      this.drag.startY = e.pageY - this.track.offsetTop
      this.drag.scrollTop = this.track.scrollTop
    } else {
      this.drag.startX = e.pageX - this.track.offsetLeft
      this.drag.scrollLeft = this.track.scrollLeft
    }
  }

  onMouseLeave(e) {
    this.drag.press = false
    this.track.classList.remove('on-drag')
  }

  onMouseUp(e) {
    this.drag.press = false
    this.track.classList.remove('on-drag')
  }

  onMouseMove(e) {
    e.preventDefault()
    if (this.drag.press) {
      if (!this.track.classList.contains('on-drag')) {
        this.track.classList.add('on-drag')
      }

      if (this.options.direction === 'vertical') {
        const delta = this.drag.startY - e.pageY
        this.track.scrollTop = this.drag.scrollTop + delta
      } else {
        const delta = this.drag.startX - e.pageX
        this.track.scrollLeft = this.drag.scrollLeft + delta
      }
    }
  }

  onMouseWheel(e) {
    if (this.options.direction === 'vertical') {
      e.preventDefault()
    }
  }

  attachEvent() {
    if (this.track.firstElementChild) {
      this.track.addEventListener('scroll', this.onScroll.bind(this))
    }
  }

  initNavigation() {
    if (this.slidesCount <= this.slidesPerView) {
      addClass(selectors.HIDDEN_CLASS, this.previousButton)
      addClass(selectors.HIDDEN_CLASS, this.nextButton)
    } else {
      if (!this.options.loop) addClass(selectors.BUTTON_DISABLED_CLASS, this.previousButton)
      removeClass('hidden', this.nextButton.parentElement)

      this.previousButton.removeEventListener('click', this.previous)
      this.previousButton.addEventListener('click', this.previous.bind(this))

      this.nextButton.removeEventListener('click', this.next)
      this.nextButton.addEventListener('click', this.next.bind(this))
    }
  }

  initDots() {
    if (this.dotsWrap && this.maxIndex > 1) {
      this.dotsWrap.innerHTML = ''

      for (let index = 0; index < this.maxIndex; index++) {
        const dot = document.createElement('div')
        dot.classList.add('carousel-dots-item')
        dot.setAttribute('data-index', index)

        if (this.currentIndex === index) {
          dot.classList.add(selectors.ITEM_ACTIVE_CLASS)
        }

        dot.addEventListener('click', (e) => {
          this.onClickDots(e)
        })

        this.dotsWrap.appendChild(dot)
      }
    }
  }

  updateDotsActive(index) {
    if (this.dotsWrap) {
      const items = selectAll(selectors.DOT_ITEM_SELECTOR, this.dotsWrap)
      items.forEach((item) => {
        if (parseInt(item.getAttribute('data-index')) === index) {
          addClass(selectors.ITEM_ACTIVE_CLASS, item)
        } else {
          removeClass(selectors.ITEM_ACTIVE_CLASS, item)
        }
      })
    }
  }

  setActiveSlide (index) {
    if (index <= this.slidesCount + this.slidesPerView && index >= 0) {
      const indexActive = index + this.slidesPerView - 1
      this.scroll(indexActive)
    }
  }

  updateNavigation(index) {
    if (!this.options.loop) {
      if (index === this.maxIndex - 1) {
        addClass(selectors.BUTTON_DISABLED_CLASS, this.nextButton)
      } else {
        removeClass(selectors.BUTTON_DISABLED_CLASS, this.nextButton)
      }
      if (index === 0) {
        addClass(selectors.BUTTON_DISABLED_CLASS, this.previousButton)
      } else {
        removeClass(selectors.BUTTON_DISABLED_CLASS, this.previousButton)
      }
    }
  }

  getRateChild(items) {
    if (this.options.direction === 'vertical') {
      return this.getOffsetHeight(items[0]) / this.getOffsetHeight(this.track.parentElement)
    } else {
      return this.getOffsetWidth(items[0]) / this.getOffsetWidth(this.track.parentElement)
    }
  }

  onKeyup(e) {
    switch (e.key) {
      case 'ArrowLeft':
        return this.setIndex(this.currentIndex - 1)
      case 'ArrowRight':
        return this.setIndex(this.currentIndex + 1)
    }
  }

  onScroll() {
    clearTimeout(this.scrollTimeout)
    clearInterval(this.autoplayInterval)
    this.scrollTimeout = setTimeout(() => {
      for (let index = 0; index < this.virtualItems.length; index++) {
        const item = this.virtualItems[index]
        const onIndex = this.options.direction === 'vertical' ? Math.abs(this.track.scrollTop - item.offsetTop) === 0 : Math.abs(this.track.scrollLeft - item.offsetLeft) < 10
        if (onIndex) {
          const newIndex = this.options.loop ? index - this.slidesPerView : index
          this.updateHeightSlider(index)
          this.currentIndex = newIndex
          this.virtualIndex = index
          this.updateNavigation(this.currentIndex)
          this.updateDotsActive(this.currentIndex)
          this.onSlideChange()
          if (this.options.loop) {
            this.handleLoop()
          }

          if (this.options.autoplay) {
            this.autoPlay()
          }
          break
        } else {
          const newIndex = this.options.loop ? index - this.slidesPerView : index - this.slidesPerView + 1
          this.currentIndex = newIndex
          this.updateNavigation(this.currentIndex)
        }
      }
    }, 20)
  }

  handleLoop() {
    if (this.virtualIndex >= this.slidesCount + this.slidesPerView) {
      this.track.classList.add('!scroll-auto')
      this.scroll(0)
    } else if (this.virtualIndex < this.slidesPerView) {
      this.track.classList.add('!scroll-auto')
      this.scroll(this.slidesCount - 1)
    } else {
      this.track.classList.remove('!scroll-auto')
    }
  }

  updateHeightSlider(currentIndex) {
    if (this.options.watchHeight) {
      const itemHeight = this.virtualItems[currentIndex].offsetHeight
      this.track.style.height = `${itemHeight}px`
    }
  }

  checkEnable(items) {
    if (this.options.direction === 'vertical') {
      return this.getOffsetHeight(items[0]) * items.length > this.getOffsetHeight(this.track.parentElement)
    } else {
      return this.getOffsetWidth(items[0]) * items.length > this.getOffsetWidth(this.track.parentElement)
    }
  }

  previous() {
    const index = this.currentIndex - 1

    this.updateNavigation(index)
    this.setIndex(index)
  }

  next() {
    const index = this.currentIndex + 1

    this.updateNavigation(index)
    this.setIndex(index)
  }

  scroll(index) {
    const newIndex = this.options.loop ? index + this.slidesPerView : index
    const item = this.virtualItems[newIndex]
    if (item) {
      if (this.options.direction === 'vertical') {
        let offsetTop = item.offsetTop
        if (index === 0) offsetTop = this.initOffsetTop
        this.track.scrollTop = offsetTop
      } else {
        let offsetLeft = item.offsetLeft
        if (index === 0) offsetLeft = this.initOffsetLeft
        this.track.scrollLeft = offsetLeft
      }
    }
  }

  onClickDots(e) {
    const target = e.target
    if (target) {
      const index = parseInt(target.getAttribute('data-index'))
      this.setIndex(index)
    }
  }

  setIndex(index) {
    if (!this.options.loop) {
      if (index < 0) {
        index = 0
      } else if (index > this.maxIndex) {
        index = this.maxIndex
      }
    }
    this.scroll(index)
  }

  getOffsetWidth(el) {
    return el.getBoundingClientRect().width
  }

  getOffsetLeft(el) {
    return el.getClientRects()[0].x
  }

  getOffsetHeight(el) {
    return el.getBoundingClientRect().height
  }

  getOffsetTop(el) {
    return el.getClientRects()[0].y
  }

  onSlideChange() {
    this.element.dispatchEvent(new CustomEvent('change-index', {
      detail: {
        index: this.currentIndex
      }
    }))
  }

  watchContent(el) {
    const config = { attributes: true, childList: true, subtree: true }

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.')
        } else if (mutation.type === 'attributes') {
          console.log(`The ${mutation.attributeName} attribute was modified.`)
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(el, config)
    observer.disconnect()
  }

  destroy() {
    if (this.dotsWrap) {
      this.dotsWrap.innerHTML = ''
    }
  }

  autoPlay() {
    this.autoplayInterval = setInterval(() => {
      this.setIndex(++this.currentIndex)
    }, this.options.autoplay)
  }

  duplicateSlides() {
    const firstItems = []
    const lastItems = []

    for (let i = 0; i < this.slidesPerView; i++) {
      const firstItem = this.items[i].cloneNode(true)
      firstItem.classList.add('duplicate-slide')

      firstItems.push(firstItem)
    }

    for (let i = this.slidesCount - 1; i >= this.slidesCount - this.slidesPerView; i--) {
      const lastItem = this.items[i].cloneNode(true)
      lastItem.classList.add('duplicate-slide')

      lastItems.push(lastItem)
    }
    this.track.prepend(...lastItems.reverse())
    this.track.append(...firstItems)
    this.virtualItems = [...this.track.children]
    this.virtualIndex = this.slidesPerView
    if (this.options.direction === 'vertical') {
      this.initOffsetTop = lastItems.reduce((par, item) => par + item.offsetHeight, 0)
    } else {
      this.initOffsetLeft = lastItems.reduce((par, item) => par + item.offsetWidth, 0)
    }
  }
}

class CarouselThumbs extends CarouselInstance {
  constructor (element, options) {
    super(element, options)
    this.activeIndex = 0

    if (this.options.asNavFor) {
      this.carouselMain = select(this.options.asNavFor)

      if (this.carouselMain) {
        customElements.whenDefined('carousel-main').then(() => {
          this.instanceMain = this.carouselMain.instance
          this.attachEventCarouselMain()
          this.attachEventClick()

          // Init active slide
          this.setIndexMain(0)
          this.setActiveSlide(0)
        })
      }
    }
  }

  attachEventClick () {
    map((item, index) => {
      on('click', this.onClickSlide.bind(this, index), item)
    }, this.virtualItems)
  }

  attachEventCarouselMain () {
    on('change-index', (e) => {
      const { index } = e.detail

      this.activeIndex = index
      this.setActiveSlide(index)
      if (index >= this.currentIndex - this.slidesPerView) {
        this.setIndex(index)
      }
    }, this.carouselMain)
  }

  next () {
    super.next()
    if (this.activeIndex < this.slidesCount) {
      this.activeIndex += 1
    } else if (this.activeIndex >= this.slidesCount && this.options.loop) {
      this.activeIndex = 1
    }

    this.setActiveSlide(this.activeIndex)

    this.setIndexMain(this.activeIndex)
  }

  previous () {
    super.previous()
    if (this.activeIndex > 0) {
      this.activeIndex -= 1
    }

    this.setActiveSlide(this.activeIndex)

    this.setIndexMain(this.activeIndex)
  }

  setActiveSlide (index) {
    if (index <= this.slidesCount + this.slidesPerView && index >= 0) {
      const indexActive = index + this.slidesPerView
      this.activeIndex = index
      this.updateNavigation()
      map(removeClass('is-active'), this.virtualItems)
      if (this.options.loop) {
        addClass('is-active', this.virtualItems[indexActive])
      } else {
        addClass('is-active', this.items[index])
      }

      // active duplicate slide
      if (this.options.loop) {
        if (indexActive < 2 * this.slidesPerView) {
          addClass('is-active', this.virtualItems[indexActive + this.slidesCount])
        } else {
          addClass('is-active', this.virtualItems[indexActive - this.slidesCount])
        }
      }
    }
  }

  updateNavigation () {
    if (!this.options.loop) {
      if (this.activeIndex === this.slidesCount - 1) {
        addClass(selectors.BUTTON_DISABLED_CLASS, this.nextButton)
      } else {
        removeClass(selectors.BUTTON_DISABLED_CLASS, this.nextButton)
      }
      if (this.activeIndex === 0) {
        addClass(selectors.BUTTON_DISABLED_CLASS, this.previousButton)
      } else {
        removeClass(selectors.BUTTON_DISABLED_CLASS, this.previousButton)
      }
    }
  }

  setIndexMain (index) {
    if (this.instanceMain) {
      if (index >= this.slidesCount) {
        this.instanceMain.setIndex(index - this.slidesCount)
      } else {
        this.instanceMain.setIndex(index)
      }
    }
  }

  onClickSlide (index) {
    const newIndex = this.options.loop ? index - this.slidesPerView : index
    this.setActiveSlide(newIndex)

    this.setIndexMain(newIndex)
  }
}

export { CarouselInstance, CarouselThumbs }
