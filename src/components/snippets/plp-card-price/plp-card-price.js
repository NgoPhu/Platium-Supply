import Price from 'snippets/price/price'

function PlpCardPrice({ price, originalPrice }) {
  return (
    <Price
      price={price}
      originalPrice={originalPrice}
      className="flex flex-row-reverse items-center justify-end gap-2 plp-card-price"
      classSize="text-sm font-body font-normal text-grey-900"
      classColor="text-lg text-primary !font-bold font-body md:text-xl"
    />
  )
}

export default PlpCardPrice
