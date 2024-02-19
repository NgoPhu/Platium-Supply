import register from 'preact-custom-element'
import CartNotificationItem from 'snippets/cart-notification-item/cart-notification-item'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

register(CartNotificationItem, 'cart-notification-item')
