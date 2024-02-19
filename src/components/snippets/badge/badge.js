function Badge({ items, className = 'flex flex-col' }) {
  return (
    items.length > 0 && (
      <div className={className}>
        {items.splice(0, 2).reverse().map((item) => (
          <span className={`badge text-center ${item.customClass}`} style={{ color: `${item.textColor}`, backgroundColor: `${item.backgroundColor}` }}>{item.text}</span>
        ))}
      </div>
    )
  )
}

export default Badge
