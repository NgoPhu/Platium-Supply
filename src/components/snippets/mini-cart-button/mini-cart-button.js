import CartCheckout from 'snippets/cart-checkout/cart-checkout'

function MiniCartButton({ cart }) {
  return (
    <div className="pb-4 bg-white">
      <CartCheckout type="mini-cart" className="flex flex-col gap-3" totalPrice={cart.total_price} cartCount={cart.item_count} />
    </div>
  )
}

export default MiniCartButton
