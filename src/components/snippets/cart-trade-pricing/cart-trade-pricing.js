import Icon from 'snippets/icon/icon'
import { Fragment } from 'preact'

function CartTradePricing({ cart, className }) {
  const threholdTradePricingText = window.GM_STATE.cart.threholdTradePricingText
  const threholdTradePricingAmount = window.GM_STATE.cart.threholdTradePricingAmount
  const isDisplay = Number(cart.total_price / 100) > Number(threholdTradePricingAmount)

  return (
    <Fragment>
      {isDisplay && (
        <div className={`bg-success-bg rounded-[10px] ${className}`}>
          <div className="font-bold text-secondary [&>p>a]:underline" dangerouslySetInnerHTML={{ __html: threholdTradePricingText }}></div>
        </div>
      )}
    </Fragment>
  )
}

export default CartTradePricing
