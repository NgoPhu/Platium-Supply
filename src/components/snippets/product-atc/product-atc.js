/* global globalEvents */
import { addCartItem, getCart, getMaxQuantityByVariant } from 'helpers/cart'
import { Fragment } from 'preact'
import { eventProps } from 'helpers/global'
import { useState, useEffect, useMemo, useRef } from 'preact/hooks'
import ButtonATC from 'snippets/button-atc/button-atc'
import QuantityInput from 'snippets/quantity-input/quantity-input'
import { openModal, hideModal, addClass, removeClass } from 'helpers/dom'
import CustomModalDialog from 'snippets/custom-modal-dialog/custom-modal-dialog'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import Icon from 'snippets/icon/icon'

const selectors = {
  BUTTON_HIDDEN_CLASS: 'button-hidden'
}

function ProductATC({ currentVariant, productData, currentVariantData, buttonText, buttonClass = 'w-full md:w-1/2', classWrapper = '', classInner = 'w-full', classStatus = '', classWrapQuantity = 'min-h-[56px] w-full md:w-[191px]', classWrapperQuantity = 'mb-5 lg:mb-6', classButtonWishlist = '' }) {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState(window.GM_STATE.cart.initCart.items)
  const [maxQuantity, setMaxQuantity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reRenderKey, setReRenderKey] = useState(1)
  const refButtonHidden = useRef(null)
  const refProductAddToCart = useRef(null)
  const isPreorder = productData?.tags.includes('preorder')

  const isDisabled = useMemo(() => quantity > maxQuantity, [quantity, maxQuantity])

  const resetQuantity = (value = 1) => {
    setQuantity(value)
    setReRenderKey(reRenderKey + 1)
  }

  const addToCart = async () => {
    setIsAdding(true)
    const properties = {}

    const cartSingle = await addCartItem(currentVariant.id, properties, quantity)

    if (cartSingle) {
      globalEvents.emit(eventProps.cart.add, cartSingle)
    }

    const max = getMaxQuantityByVariant(cartSingle.items, currentVariantData)

    if (max > 0 && max < quantity) {
      resetQuantity(max)
    }

    if (max <= 0) {
      resetQuantity(1)
    }

    setIsAdding(false)
    syncMaxQuantity()

    if (isPreorder) {
      hideModal('modal-preorder')
      clearAllBodyScrollLocks()
    }
  }

  const handleAddToCart = () => addToCart()

  const getMaxQuantity = async (variant) => {
    const cartData = await getCart()
    setCartItems(cartData.items)
    return getMaxQuantityByVariant(cartData.items, variant)
  }

  const syncMaxQuantity = async () => {
    setIsLoading(true)
    const maxValue = await getMaxQuantity(currentVariantData)
    setMaxQuantity(maxValue)
    setIsLoading(false)
  }

  const updateMaxQuantity = (items) => {
    setIsLoading(true)
    const maxValue = getMaxQuantityByVariant(items, currentVariantData)
    setCartItems(items)
    setMaxQuantity(maxValue)
    setIsLoading(false)
  }

  const cartUpdateListener = (items) => updateMaxQuantity(items, currentVariantData)

  useEffect(() => {
    if (currentVariantData) {
      resetQuantity(1)
      updateMaxQuantity(cartItems, currentVariantData)
      globalEvents.on(eventProps.cart.update, cartUpdateListener)
    }
    return () => {
      globalEvents.off(eventProps.cart.update, cartUpdateListener)
    }
  }, [currentVariantData])

  useEffect(() => {
    if (refProductAddToCart?.current && refButtonHidden.current) {
      const options = {
        threshold: 0.1
      }

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addClass(selectors.BUTTON_HIDDEN_CLASS, refButtonHidden.current)
          } else {
            removeClass(selectors.BUTTON_HIDDEN_CLASS, refButtonHidden.current)
          }
        })
      }, options)

      observer.observe(refProductAddToCart.current)
    }
  }, [])

  return (
    <Fragment>
      <div ref={refProductAddToCart} className={`${classWrapper}`}>
        <div className={`flex items-start overflow-hidden ${classWrapperQuantity}`}>
          <div className={`flex flex-row items-center md:gap-1 ${classInner} ${!(currentVariant.available && maxQuantity > 0) ? (!isPreorder && 'pointer-events-none') : ''}`}>
            <QuantityInput
              key={reRenderKey}
              quantity={quantity}
              min={1}
              max={maxQuantity}
              setQuantity={setQuantity}
              isLoading={isLoading}
              classWrap={`md-max:border-r-0 md-max:rounded-r-none ${classWrapQuantity}`}
              classButton="w-8 h-14 md:w-10"
            />
            {currentVariant.available && maxQuantity > 0 ? (
              <ButtonATC
                disabled={isDisabled}
                text='Add'
                onHandle={handleAddToCart}
                price={currentVariant.price}
                loading={isAdding}
                buttonClass={`md-max:rounded-l-none md:hidden ${buttonClass}`}
              />
            ) : (
              <button
                className={`button-primary button-large md-max:rounded-l-none ${buttonClass} md:hidden`}
                onClick={() => openModal('modal-preorder')}
                disabled={!isPreorder === true}
              >
                {isPreorder ? 'Pre-order now' : 'Out of stock'}
              </button>
            )}
          </div>
        </div>
        <Fragment>
          <div className="flex flex-col gap-4 md:flex-row">
            {currentVariant.available && maxQuantity > 0 ? (
              <ButtonATC
                disabled={isDisabled}
                text={buttonText}
                onHandle={handleAddToCart}
                price={currentVariant.price}
                loading={isAdding}
                buttonClass={`md-max:hidden ${buttonClass}`}
              />
            ) : (
              <button
                className={`button-primary normal-case md-max:hidden ${buttonClass}`}
                onClick={() => isPreorder && openModal('modal-preorder')}
                disabled={!isDisabled === true}
              >
                {isPreorder ? 'Pre-order now' : 'Out of stock'}
              </button>
            )}
            <modal-opener data-id="wishlist-add-list-modal" className={`md:w-1/2 ${classButtonWishlist}`}>
              <button className="relative flex items-center justify-center w-full text-sm font-semibold button-outlined border-focus font-body text-grey-900 h-14 px-2.5 lg:px6">
                <Icon name="icon-wishlist" className="w-6 h-6 mr-2 text-secondary" />
                Save to Wishlist
              </button>
            </modal-opener>
          </div>
        </Fragment>
        <CustomModalDialog
          id="modal-preorder"
          header={window.translate.product.headingModalPreorder}
          content={window.translate.product.descriptionModalPreorder}
          useRichtext={true}
          footer={
            <ButtonATC
              text="Proceed with Preorder"
              onHandle={handleAddToCart}
              buttonClass="normal-case md-max:w-full"
              loading={isAdding}
            />
          }
          classContent="mt-2 mb-6 [&>p]:mb-2 lg:mb-8"
          classMain="w-[calc(100%-32px)] p-6 overflow-y-auto h-fit max-h-[80vh] rounded-[10px] md:p-12 md:w-[592px]"
          classClose="!top-4 !p-0 !right-4 z-[2] !left-auto w-8 h-8 text-primary md:!top-6 md:!right-6"
          classHeader="!static font-body text-xl text-grey-900 font-bold lg:text-2xl"
        />
      </div>
      <div ref={refButtonHidden} className="w-full fixed bottom-0 left-0 z-[1] transition-opacity md:hidden">
        {currentVariant.available && maxQuantity > 0 ? (
          <ButtonATC
            disabled={isDisabled}
            text={buttonText}
            onHandle={handleAddToCart}
            price={currentVariant.price}
            loading={isAdding}
            buttonClass="w-full h-[60px] rounded-none"
          />
        ) : (
          <button
            className="button-primary button-large normal-case w-full rounded-none"
            onClick={() => isPreorder && openModal('modal-preorder')}
            disabled={!isPreorder === true}
          >
            {isPreorder ? 'Pre-order now' : 'Out of stock'}
          </button>
        )}
      </div>
    </Fragment>
  )
}

export default ProductATC
