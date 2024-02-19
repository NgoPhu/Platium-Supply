import { select, getHeight, getTopOffset } from 'helpers/dom'

const selectors = {
  HEADER_SELECTOR: '.header-sticky',
  REVIEWS_FORM_SELECTOR: '.reviews-form',
  REVIEWS_RATING_CONTENT_SELECTOR: '.ruk-rating-snippet-count'
}
class ReviewsRating extends HTMLElement {
  constructor() {
    super()
    this.handleClick()
  }

  handleClick() {
    this.addEventListener('click', () => {
      const headerEl = select(selectors.HEADER_SELECTOR)
      const headerStickyHeight = window.innerWidth < 768 ? 56 : 64
      const reviewsFormEl = select(selectors.REVIEWS_FORM_SELECTOR)
      const offset = getTopOffset(reviewsFormEl) - getHeight(headerEl) - headerStickyHeight

      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      })
    })
  }
}

customElements.define('reviews-rating', ReviewsRating)
