import register from 'preact-custom-element'
import MiniCart from 'snippets/mini-cart/mini-cart'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

register(MiniCart, 'mini-cart')
