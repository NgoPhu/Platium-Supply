import { select, selectAll, on, addClass, removeClass } from 'helpers/dom'
import { map } from 'helpers/utils'

const selectors = {
  GALLERY_IMAGE_SELECTOR: '.js-carousel-gallery .js-gallery-image',
  SCALE_CLASS: 'scale-150',
  MODAL_ZOOM_SELECTOR: 'modal-dialog',
  GALLERY_ITEM_SELECTOR: '.carousel-swiper-gallery .js-gallery-item',
  GALLERY_ZOOM_MAIN_SELECTOR: '.js-gallery-zoom-main .js-gallery-main-modal swiper-container',
  GALLERY_ZOOM_THUMB_ITEM_SELECTOR: '.js-gallery-main-modal .js-main-gallery-zoom-item',
  GALLERY_THUMB_ACTIVE_CLASS: 'is-active',
  MainCarousel: '.js-gallery-main swiper-container',
  MainModalCarousel: '.js-gallery-main-modal swiper-container'
}

export default class ProductGallery extends HTMLElement {
  constructor() {
    super()

    this.modalZoom = select(selectors.MODAL_ZOOM_SELECTOR, this)
    this.galleryItems = selectAll(selectors.GALLERY_ITEM_SELECTOR, this)
    this.mainGalleryZoom = select(selectors.GALLERY_ZOOM_MAIN_SELECTOR, this)
    this.thumbGalleryItems = selectAll(selectors.GALLERY_ZOOM_THUMB_ITEM_SELECTOR, this)
    this.MainCarousel = selectAll(selectors.MainCarousel, this)
    this.MainModalCarousel = selectAll(selectors.MainModalCarousel, this)
    this.galleryImages = selectAll(selectors.GALLERY_IMAGE_SELECTOR, this)

    window.addEventListener('load', () => {
      removeClass('is-skeleton', this)
    })
  }

  connectedCallback() {
    if (this.hasAttribute('data-enable-zoom')) {
      this.attachEvents()
    }
  }

  attachEvents() {
    map((item) => {
      if (item.dataset.mediaType === 'image') {
        on(
          'click',
          () => {
            this.modalZoom.show()
            this.setThumbActive(item.dataset.mediaId)
          },
          item
        )
      }
    }, this.galleryItems)
    this.onClickThumb()
    on('keydown', (e) => {
      if (e.keyCode === 27 || e.code?.toUpperCase() === 'ESCAPE') {
        this.modalZoom.hide()
      }

      if (e.keyCode === 39) {
        this.MainCarousel[0].swiper.slideNext()
        this.MainModalCarousel[0].swiper.slideNext()
      }

      if (e.keyCode === 37) {
        this.MainCarousel[0].swiper.slidePrev()
        this.MainModalCarousel[0].swiper.slidePrev()
      }
    }, document)

    map((item) => {
      on('mousemove', this.handleZoom.bind(this), item)
      on('mouseover', () => {
        addClass(selectors.SCALE_CLASS, item)
      }, item)
      on('mouseout', () => {
        removeClass(selectors.SCALE_CLASS, item)
      }, item)
    }, this.galleryImages)
  }

  setThumbActive(id) {
    map((item, index) => {
      if (item.dataset.mediaId === id) {
        addClass(selectors.GALLERY_THUMB_ACTIVE_CLASS, item)
        this.setMainActive(index)
      } else removeClass(selectors.GALLERY_THUMB_ACTIVE_CLASS, item)
    }, this.thumbGalleryItems)
  }

  setMainActive(index) {
    this.mainGalleryZoom.swiper.slideTo(index, 0)
  }

  onClickThumb() {
    map((item) => {
      on(
        'click',
        () => {
          const { mediaId } = item.dataset
          this.setThumbActive(mediaId)
        },
        item
      )
    }, this.thumbGalleryItems)
  }

  handleZoom(e) {
    const target = e.currentTarget
    const offsetX = e.offsetX ?? e.touches[0].pageX
    const offsetY = e.offsetY ?? e.touches[0].pageY
    const x = (offsetX / target.offsetWidth) * 100
    const y = (offsetY / target.offsetHeight) * 100
    target.style.transformOrigin = `${x}% ${y}%`
  }
}

customElements.define('product-gallery', ProductGallery)
