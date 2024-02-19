import useCartItem from 'uses/useCartItem'
import Image from 'snippets/image/image'
import QuantityInput from 'snippets/quantity-input/quantity-input'
import Price from 'snippets/price/price'

function CartItem({ item, setCart, setIsFetching }) {
  const { setQuantity, isLoading, maxQuantity, isDisabled, renderKey, onRemove } = useCartItem(item, setCart, setIsFetching)

  return (
    <div className="mb-5 pb-5 border-b last:mb-0 last:pb-0 last:border-b-0 lg:mb-6 lg:pb-6 xl:flex lg:items-center lg:gap-[30px]">
      <div className="flex items-center gap-4 xl-max:mb-5 w-full lg:max-w-[444px]">
        <a className="block max-w-[80px] md:max-w-[100px]" href={item.url} title={item.title}>
          <Image imageUrl={[item.featured_image.url]} className="aspect-[1/1]" key={item.id} />
        </a>
        <div className="flex-1">
          <a href={item.url} title={item.title} className="text-sm font-bold text-grey-900">
            {item.product_title}
          </a>
          {item.variant_title != null && item?.options_with_values &&
            <div className="mt-1 text-xs text-grey-600 lg:text-sm">
              {item.options_with_values.map(option =>
                <span className="block">{option.name}: {option.value}</span>
              )}
            </div>}
          {item.tags.includes('label-1-5-days') && <div className="px-3 text-xs py-2.5 mt-3 rounded-lg text-warning-content bg-warning-bg border border-solid border-warning-content lg-max:hidden">Note: This order has a lead time of 1-5 days</div>}
        </div>
      </div>
      <div className="flex justify-between gap-6 lg:flex-1">
        <Price
          price={item.price}
          className="flex flex-col mt-4 text-right min-w-[56px] font-semibold text-grey-900"
        />
        <div className="text-center flex flex-col gap-2">
          <QuantityInput
            key={`${item.id}-${item.quantity}-${renderKey}`}
            quantity={item.quantity}
            min={1}
            max={maxQuantity}
            setQuantity={setQuantity}
            disabled={isDisabled}
            isLoading={isLoading}
            classWrap="w-[130px]"
          />
          <button type="button" className="text-grey-600 text-xs underline hover:text-secondary" onClick={onRemove}>Remove</button>
        </div>
        <Price
          price={item.line_price}
          className="flex flex-col mt-4 text-right min-w-[56px] font-semibold text-grey-900"
        />
      </div>
      {item.tags.includes('label-1-5-days') && <div className="px-3 py-2.5 mt-5 text-xs rounded-lg text-warning-content bg-warning-bg border border-solid border-warning-content lg:hidden">Note: This order has a lead time of 1-5 days</div>}
    </div>
  )
}

export default CartItem
