import { formatMoney } from 'uses/useShopify'

function CartCheckout({ type, className, disabled = false, totalPrice }) {
  const isMiniCart = type === 'mini-cart'
  const textButtonMiniCart = `${translate.cart.checkout} - ${formatMoney(totalPrice)}`
  return (
    <div className={className}>
      <button type="submit" name="checkout" className={`button-primary normal-case w-full flex-1 ${disabled ? 'button-disabled' : ''}`}>
        {isMiniCart ? textButtonMiniCart : translate.cart.go_to_checkout}
      </button>
      {isMiniCart && (
        <a href="/cart" className="hidden button-outlined flex-1">
          {translate.cart.view_bag}
        </a>
      )}
    </div>
  )
}

export default CartCheckout
