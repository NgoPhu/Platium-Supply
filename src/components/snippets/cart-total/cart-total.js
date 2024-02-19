import Price from 'snippets/price/price'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function CartTotal({ price, isFetching }) {
  return (
    <div className="flex justify-between pb-4 lg:pb-5">
      <span className="text-base font-body font-bold text-grey-900">{translate.cart.total}</span>
      <div className="relative flex">
        <LoaderSpin show={isFetching} />
        <Price price={price} className="inline-block text-base font-bold text-grey-900 font-body" classSize="text-sm" />
      </div>
    </div>
  )
}

export default CartTotal
