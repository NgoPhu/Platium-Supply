import register from 'preact-custom-element'
import CartMain from 'snippets/cart-main/cart-main'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

class CartPage extends HTMLElement {
  constructor() {
    super()
    console.log('Cart page')
  }
}

register(CartMain, 'cart-main')
customElements.define('cart-page', CartPage)
