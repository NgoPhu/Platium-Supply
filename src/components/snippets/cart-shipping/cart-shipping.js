import { useMemo } from 'preact/hooks'
import { formatMoney } from 'uses/useShopify'
import ProgressBar from 'snippets/propgress-bar/progress-bar'

function CartShipping({ className, type, totalPrice }) {
  const amount = window.GM_STATE.cart.threholdAmount
  const enable = window.GM_STATE.cart.threholdEnable
  const isDisplayed = enable && amount > 0
  const rate = Shopify.currency && Shopify.currency.rate ? parseFloat(Shopify.currency.rate) : 1

  const styles = useMemo(() => {
    const percent = amount ? Math.min(totalPrice / (amount * rate * 100), 1) : 0
    return { transform: `scaleX(${percent})` }
  }, [totalPrice])

  const gap = useMemo(() => {
    return Math.round(amount * rate) * 100 - totalPrice
  }, [totalPrice])

  return (
    isDisplayed && (
      <div className={className}>
        <div className="text-center">
          {gap > 0 ? (
            <span className={type === 'cart-page' ? 'text-sm' : 'text-xs md:text-sm'}>
              {translate.cart.spend} <strong className="text-grey-900">{formatMoney(gap)}</strong> {translate.cart.to_receive_free_shipping}
            </span>
          ) : (
            <div className={type === 'cart-page' ? 'mb-2.5 text-sm' : 'text-xs md:text-sm'}>{translate.cart.get_free_shipping}</div>
          )}
        </div>
        {type === 'cart-page' && <ProgressBar customStyles={styles} />}
      </div>
    )
  )
}

export default CartShipping
