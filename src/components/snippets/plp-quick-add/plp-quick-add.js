/* global globalEvents */
import { Fragment } from 'preact'
import { useState } from 'preact/hooks'
import { addCartItem } from 'helpers/cart'
import { eventProps } from 'helpers/global'
import PlpCardPrice from 'snippets/plp-card-price/plp-card-price'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import Icon from '../icon/icon'

const FIND_OUT_MORE_TAG = 'findoutmore'

function PlpQuickAdd({ variants, productUrl, tags, currentVariant, setCurrentVariant, isAvailable }) {
  const [isAdding, setIsAdding] = useState(false)

  const isFindOutMore = tags.some((item) => item.includes(FIND_OUT_MORE_TAG))

  const variantFilters = variants.sort((a, b) => a.position - b.position)

  const addToCart = async () => {
    setIsAdding(true)
    const properties = {}
    const cartSingle = await addCartItem(currentVariant.id, properties, 1)
    if (cartSingle) {
      globalEvents.emit(eventProps.cart.add, cartSingle)
    }
    setIsAdding(false)
  }

  return (
    <Fragment>
      {!isFindOutMore ? (
        <Fragment>
          <div className="flex py-1">
            <Fragment>
              {variantFilters.length !== 1 &&
                variantFilters.map((variant, index) => index <= 2 ? (
                 <button
                    type="button"
                    key={variant.id}
                    className={`my-1 mr-2 rounded border px-[6px] py-[5px] text-xs text-grey-900 ${
                      variant.id === currentVariant.id ? 'pointer-events-none bg-grey-50' : ''
                    }`}
                    onClick={() => setCurrentVariant(variant)}
                  >
                    {variant.title}
                  </button>
                ) : '')}
              {
                variantFilters.length > 3 && <a href={productUrl} className="my-1 mr-2 flex items-center justify-center rounded border px-[3px] py-[5px] text-xs text-grey-900">
                  <Icon name="icon-plus" viewBox="0 0 18 18" className="w-3 h-3" />
                </a>
              }
            </Fragment>
          </div>
          <PlpCardPrice price={currentVariant.price} originalPrice={currentVariant.compare_at_price} />
          <button
            type="button"
            className="button-small button-primary plp-card-button relative mt-2 min-h-[40px] w-full text-sm font-bold tracking-normal lg:min-h-[48px]"
            disabled={!isAvailable}
            onClick={addToCart}
          >
            {isAdding ? <LoaderSpin /> : <span dangerouslySetInnerHTML={{ __html: isAvailable ? 'Add to cart' : 'Sold out' }}></span>}
          </button>
        </Fragment>
      ) : (
        <a
          className="button-small button-primary plp-card-button relative mt-2 flex min-h-[40px] w-full items-center justify-center text-sm font-bold tracking-normal lg:min-h-[48px]"
          href={productUrl}
        >
          Find out more
        </a>
      )}
    </Fragment>
  )
}

export default PlpQuickAdd
