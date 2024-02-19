/* global globalEvents */
import { eventProps } from 'helpers/global'
import { updateCart, openCartNotification } from 'helpers/cart'
import { useEffect } from 'preact/hooks'
import { delay } from 'helpers/utils'
import MiniCartList from 'snippets/mini-cart-list/mini-cart-list'
import MiniCartButton from 'snippets/mini-cart-button/mini-cart-button'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import useCartGlobal from 'uses/useCartGlobal'
import Icon from 'snippets/icon/icon'
import CartTradePricing from 'snippets/cart-trade-pricing/cart-trade-pricing'

function MiniCart() {
  const { cart, setCart, isFetching, setIsFetching, isLoaded, setIsLoaded } = useCartGlobal()

  const init = async () => {
    if (!isLoaded) {
      await delay(500)
      setIsLoaded(true)
    }
  }

  const render = async () => {
    const newCart = await updateCart()
    setCart(newCart)
    openCartNotification()
    await init()
    window.GM_STATE.cart.initCart = newCart
    globalEvents.emit(eventProps.cart.update, newCart.items)
    sessionStorage.setItem('item-cart', JSON.stringify(newCart.items))
  }

  useEffect(() => {
    globalEvents.on(eventProps.cart.add, async (value) => value && (await render()))
    globalEvents.on(eventProps.cart.render, async (value) => value && (await init()))
  }, [])

  return (
    <div className="relative flex h-full flex-col">
      <div className={`relative flex items-center justify-between px-4 pb-3 ${cart.item_count < 1 && 'border-b border-default'}`}>
        {cart.item_count > 0 ? (
          <div className="flex items-center">
            <h3 className="flex-auto text-base font-body font-bold text-grey-900">{translate.cart.heading}</h3>
            <span class="ml-2 text-sm text-grey-500 lg:ml-1">({cart.item_count} {cart.item_count > 1 ? 'Items' : 'Item'})</span>
          </div>
        ) : (
          <h3 className="flex-auto text-base font-body font-bold text-grey-900">{translate.cart.heading}</h3>
        )}
        <button type="button" className="js-close-modal-dialog" aria-label="close mini cart">
          <Icon viewBox="0 0 24 24" name="icon-close-bold" className="w-6 h-6 text-grey-900" />
        </button>
      </div>
      <div class="js-mini-cart-content">
        <form action="/cart" method="POST" className="px-4" id="cart">
          {cart && cart.items.length ? (
            isLoaded ? (
              <>
                <MiniCartButton cart={cart} />
                <MiniCartList items={cart.items} setCart={setCart} setIsFetching={setIsFetching} isFetching={isFetching} />
              </>
            ) : (
              <div className="flex items-center justify-center">
                <LoaderSpin width="10" height="10" />
              </div>
            )
          ) : (
            <div className="col-span-2 bg-white">
              <div class="py-12 text-center md:py-20 xl:py-10">
                <h1 className="h3 text-2xl font-semibold">{translate.cart.empty_cart}</h1>
                <a href="/collections/all" className="button-primary mt-2">
                  {translate.cart.continue_shopping}
                </a>
              </div>
            </div>
          )}
        </form>
        <CartTradePricing cart={cart} className="mx-4 mb-4 p-4" />
      </div>
    </div>
  )
}

export default MiniCart
