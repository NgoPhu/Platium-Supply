/* global globalEvents */
import useCartItem from 'uses/useCartItem'
import Image from 'snippets/image/image'
import Price from 'snippets/price/price'

function MiniCartItem({ item, setCart, setIsFetching, className, classImage }) {
  const { onRemove } = useCartItem(item, setCart, setIsFetching)

  return (
    <div className={`flex gap-4 pb-4 mb-4 border-b last:mb-0 last:border-b-0 ${className}`}>
      <div className="relative">
        <a href={`/products/${item.handle}`}>
          <Image imageUrl={[item.featured_image.url]} imageClass="fit" className={`aspect-[1/1] w-20 ${classImage}`} key={item.id} />
        </a>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mini-cart-item-inner">
          <a href={item.url} className="text-sm text-grey-900 [&>b]:font-semibold" title={item.title}>{item.quantity} x {item.product_title}</a>
          <Price
            price={item.line_price}
            className="flex flex-col font-bold text-grey-900"
          />
        </div>
        <button type="button" className="text-secondary text-left underline text-med mt-1 mini-cart-item-button hover:text-secondary-hover" onClick={onRemove}>Remove</button>
      </div>
    </div>
  )
}

export default MiniCartItem
