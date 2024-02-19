/* global GM_STATE */
import { Fragment } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { eventProps } from 'helpers/global'
import { updateCart } from 'helpers/cart'
import { delay } from 'helpers/utils'
import CartGrid from 'snippets/cart-grid/cart-grid'
import CartSidebar from 'snippets/cart-sidebar/cart-sidebar'
import useDisabledSubmitFormWithEnter from 'uses/useDisabledSubmitFormWithEnter'
import useCartGlobal from '@/components/uses/useCartGlobal'
import CartTradePricing from 'snippets/cart-trade-pricing/cart-trade-pricing'
import CartEstimateShipping from 'snippets/cart-estimate-shipping/cart-estimate-shipping'
import CartNdis from 'snippets/cart-ndis/cart-ndis'

function CartMain() {
  const { cart, setCart, isFetching, setIsFetching } = useCartGlobal()
  const cartRef = useRef(null)
  useDisabledSubmitFormWithEnter(cartRef)

  useEffect(() => {
    globalEvents.on(eventProps.cart.add, async (cartSingle) => {
      if (!cartSingle) return
      const newCart = await updateCart()
      setCart(newCart)
      await delay(500)
      window.GM_STATE.cart.initCart = newCart
      globalEvents.emit(eventProps.cart.update, newCart.items)
    })
  }, [])

  if (!cart?.items?.length) {
    return (
      <div className="container col-span-2 md-max:border-b md-max:border-custom">
        <div class="py-8 text-center md:py-[120px]">
          <h2 className="h3 text-xl font-body md:text-2xl">{translate.cart.empty_cart}</h2>
          <a href="/collections/all" class="button-primary flex w-fit mx-auto mt-3 lg:mt-5">
            {translate.cart.continue_shopping}
          </a>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      <form ref={cartRef} action="/cart" method="POST" id="cart" className="pt-6 pb-8 lg:pt-8 lg:pb-20">
        <div className="container">
          <form method="post" action="/checkout">
            <div className="flex items-center justify-between pb-4 md:pb-5">
              <h1 className="text-xl font-body text-grey-900 font-bold md:text-2xl">{translate.cart.my_bag}</h1>
              <a className="font-bold font-body text-secondary" href="/collections/all">
                {translate.cart.continue_shopping_cart}
              </a>
            </div>
            <div className="items-start gap-8 lg:grid lg:grid-flow-col lg:gap-12 lg:grid-cols-[1fr_380px]">
              <div className="rounded-[10px] border border-grey-300 shadow-base p-4 pb-6 bg-white lg:p-8">
                <CartTradePricing cart={cart} className="p-5 mb-5 lg:mb-6" />
                <CartGrid items={cart.items} setCart={setCart} setIsFetching={setIsFetching} />
              </div>
              <div>
                <CartNdis />
                <div className="rounded-[10px] border border-grey-300 shadow-base bg-white lg-max:mt-4">
                  {GM_STATE.cart.enableEstimateShipping && <CartEstimateShipping />}
                  <CartSidebar cart={cart} isFetching={isFetching} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </form>
    </Fragment>
  )
}

export default CartMain
