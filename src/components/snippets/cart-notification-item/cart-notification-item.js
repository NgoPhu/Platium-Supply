/* global globalEvents */
import MiniCartItem from 'snippets/mini-cart-item/mini-cart-item'
import { eventProps } from 'helpers/global'
import { useState } from 'preact/hooks'
import { addClass, select } from 'helpers/dom'

function CartNotificationItem() {
  const [data, setData] = useState(null)
  const buttonTrigger = select('#MiniCart.js-modal-dialog-trigger')

  globalEvents.on(eventProps.cart.add, async (value) => {
    buttonTrigger && addClass('active', buttonTrigger)
    setData(value)
  })
  return (
    <form method="post" action="/checkout">
      {data?.items.map((item) => (
        <MiniCartItem item={item} className="mini-cart-item-notification" />
      ))}
      <a href="/cart" className="button-primary w-full">Checkout</a>
    </form>
  )
}

export default CartNotificationItem
