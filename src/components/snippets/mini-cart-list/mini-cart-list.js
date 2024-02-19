import MiniCartItem from 'snippets/mini-cart-item/mini-cart-item'

function MiniCartList({ items, setCart, isFetching, setIsFetching }) {
  return (
    <div className="flex flex-col">
      {items.map((cartItem) => (
        <MiniCartItem item={cartItem} setCart={setCart} isFetching={isFetching} setIsFetching={setIsFetching} classImage="!w-16" />
      ))}
    </div>
  )
}

export default MiniCartList
