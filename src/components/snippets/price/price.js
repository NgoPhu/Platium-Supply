import { formatMoney } from 'uses/useShopify'

function Price({ className = '', price = 0, originalPrice = null, classSize = 'text-sm', classColor = '' }) {
  const customClass = `price ${className}`
  const isSale = originalPrice && originalPrice !== 0 && originalPrice > price
  const colorSalePrice = isSale ? `${classSize} ${classColor}` : `${classColor}`
  return (
    <div className={customClass}>
      {isSale ? <span className={`text-default line-through ${classSize}`}>{formatMoney(originalPrice)}</span> : ''}
      <span className={colorSalePrice}>{formatMoney(price)}</span>
    </div>
  )
}

export default Price
