import CartItem from 'snippets/cart-item/cart-item'

function CartGrid({ items, setCart, setIsFetching }) {
  return (
    <div className="flex flex-col">
      {items
        .filter((cartItem) => !cartItem?.properties?.isCartGift)
        .map((cartItem) => (
          <CartItem item={cartItem} setCart={setCart} setIsFetching={setIsFetching} />
        ))}
    </div>
  )
}

export default CartGrid
