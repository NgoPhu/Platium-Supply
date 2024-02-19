function CartBadge({ items }) {
  return (
    items.length && (
      <div className="mt-2">
        {items.map((item) => {
          return <div className={item.class}>{item.name}</div>
        })}
      </div>
    )
  )
}

export default CartBadge
