import { useEffect, useMemo, useRef, useState } from 'preact/hooks'
import ProductVariant from 'snippets/product-variant/product-variant'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import Price from 'snippets/price/price'
import { Fragment } from 'preact'
import { addCartItem } from 'helpers/cart'
import { eventProps } from 'helpers/global'
import useClickOutSide from 'uses/useClickOutSide'

function PlpQuickAddModal({ activeModal, variants, options, setActiveModal, isMiniCart = false }) {
  const currentRef = useRef()
  const [currentVariant, setCurrentVariant] = useState({})
  const [available, setAvailable] = useState(null)
  const [price, setPrice] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  const initVariant = useMemo(() => (variants && variants.length > 0 ? variants[0] : {}), [variants])
  const buttonText = useMemo(() => (available ? translate.collection.selectSize : translate.collection.soldOut), [available])

  const state = {
    setCurrentVariant
  }

  const handleClose = () => {
    currentRef.current.classList.add('animation-fade-in-down')
    currentRef.current.classList.remove('animation-fade-in-up')
    setTimeout(() => {
      setActiveModal(false)
    }, 300)
  }

  const addToCart = async () => {
    setIsAdding(true)
    const properties = {}
    const cartItem = await addCartItem(currentVariant.id, properties, 1)
    if (cartItem) {
      globalEvents.emit(eventProps.cart.add, cartItem)
    }
    setIsAdding(false)
    handleClose()
  }

  useEffect(() => {
    setAvailable(currentVariant.available)
    setPrice(currentVariant.price)
  }, [currentVariant])

  useClickOutSide(currentRef, handleClose)

  return (
    <Fragment>
      {activeModal && (
        <div>
          <div
            ref={currentRef}
            className={`fixed top-1/2 left-1/2 w-[344px] -translate-x-1/2 -translate-y-1/2 rounded border border-default bg-white
              ${
                isMiniCart
                  ? 'animation-slide-in-up'
                  : 'animation-fade-in-up xl:absolute xl:top-auto xl:bottom-0 xl:w-full xl:translate-y-0 xl:rounded-none xl:border-0'
              }
              ${activeModal ? 'pointer-events-auto z-[31] opacity-100 xl:z-[19]' : 'pointer-events-none -z-10 xl:opacity-100'}`}
          >
            <div className="relative border-b border-default p-6 text-center 3xl:border-t">
              <h3 className="text-text-xs font-bold uppercase text-grey-900">{translate.collection.selectOption}</h3>
              <button className="absolute right-6 top-1/2 -translate-y-1/2" type="button" onClick={handleClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="h-4 w-4 text-grey-500">
                  <path
                    id="icon-close-outline"
                    d="M13.333 13.333 2.667 2.667M13.333 2.667 2.667 13.333"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 pt-1 3xl:p-8 3xl:pt-3">
              <ProductVariant variants={variants} options={options} state={state} initVariant={initVariant} isModal={true} />
              <button className="button-primary w-full 3xl:mt-2" disabled={!available} onClick={addToCart}>
                {isAdding ? (
                  <LoaderSpin />
                ) : (
                  <Fragment>
                    {buttonText} (<Price className="inline" price={price} />)
                  </Fragment>
                )}
              </button>
            </div>
          </div>
          <div
            className={`fixed top-0 left-0 z-10 h-full w-full bg-overlay ${
              !isMiniCart && 'xl:absolute xl:bg-white-overlay xl:backdrop-blur-[6px]'
            }`}
            onClick={handleClose}
          ></div>
        </div>
      )}
    </Fragment>
  )
}

export default PlpQuickAddModal
