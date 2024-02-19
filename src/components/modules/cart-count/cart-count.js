/* global globalEvents */
import { addClass, removeClass, select } from 'helpers/dom'
import { eventProps } from 'helpers/global'
import { reRenderCartCount } from 'helpers/cart'

const selectors = {
  countSelector: '#CartCount',
  countActiveClass: 'flex'
}

class CartCount extends HTMLElement {
  constructor() {
    super()
    this.countEl = select(selectors.countSelector, this)
    this.attachEvent()
  }

  attachEvent() {
    globalEvents.on(eventProps.cart.change, (value) => {
      reRenderCartCount(value)
    })
  }
}

if (!customElements.get('cart-count')) {
  customElements.define('cart-count', CartCount)
}
