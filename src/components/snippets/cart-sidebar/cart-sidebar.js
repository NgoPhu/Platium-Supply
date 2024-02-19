import { formatMoney } from 'uses/useShopify'
import CartShipping from 'snippets/cart-shipping/cart-shipping'
import CartCheckout from 'snippets/cart-checkout/cart-checkout'
import CartTotal from 'snippets/cart-total/cart-total'

function CartSidebar({ cart, isFetching }) {
  return (
    <div>
      <div className="px-4 py-5 md:p-6">
        <div className="pb-4 mb-4 border-b">
          <div className="mb-2 flex justify-between text-sm text-grey-600">
            <span>{translate.cart.subtotal}</span>
            <span>{formatMoney(cart.items_subtotal_price)}</span>
          </div>
          <div className="text-sm italic text-grey-600">{translate.cart.taxes_and_shipping_at_checkout}</div>
        </div>
        <CartTotal price={cart.total_price} isFetching={isFetching} />
        <CartCheckout className="flex" />
      </div>
    </div>
  )
}

export default CartSidebar
