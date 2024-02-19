import { getData, selectAll, select, getHeight, getTopOffset, on, getAttribute } from 'helpers/dom'
import throttle from 'lodash.throttle'
import { Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { formatMoney } from 'uses/useShopify'
import { eventProps } from 'helpers/global'

const ANCHOR_CLASS = '.anchor-section'
const ANCHOR_ID_ATTR = 'anchor-id'
const ANCHOR_ITEM_SELECTOR = '.js-anchor-section'
const PRODUCT_FORM_CLASS = '.js-product-form'

function AnchorSection() {
  const [itemsData, setItemsData] = useState([])
  const [currentIndex, setCurrentIndex] = useState('')
  const [isShownOnTarget, setIsShownOnTarget] = useState(false)
  const [currentVariant, setCurrentVariant] = useState(window.productState.initVariant)
  const productFormEl = select(PRODUCT_FORM_CLASS)

  useEffect(() => {
    setItemsData(
      selectAll(ANCHOR_ITEM_SELECTOR).map((item, index) => ({
        index,
        id: getAttribute('id', item),
        title: getData('title', item),
        active: false
      }))
    )

    globalEvents.on(eventProps.product.updateVariant, (value) => {
      setCurrentVariant(value)
    })
  }, [])

  useEffect(() => {
    if (itemsData.length) {
      handleScroll()
    }
  }, [itemsData])

  const scrollToSection = (evt) => {
    const anchorEl = evt.target
    const anchorId = getData(ANCHOR_ID_ATTR, anchorEl)
    if (!anchorId) {
      return
    }
    const destinationEl = select(`#${anchorId}`)
    if (destinationEl) {
      const offset = getTopOffset(destinationEl) - getStickyHeight()
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    on(
      'scroll',
      throttle(() => {
        const topScroll = Math.floor(window.scrollY + getStickyHeight())
        for (let i = 0; i < itemsData.length; i++) {
          const item = itemsData[i]
          const itemEl = select(`#${item.id}`)
          if (itemEl) {
            const topOffset = Math.floor(getTopOffset(itemEl))
            if (topScroll >= topOffset) {
              setCurrentIndex(item.id)
            }
          }
        }

        checkScrollShowTarget()
      }, 100),
      window
    )
  }

  const checkScrollShowTarget = () => {
    if (window.pageYOffset > getTopOffset(productFormEl) + getHeight(productFormEl) - getStickyHeight() + 56) {
      setIsShownOnTarget(true)
    } else {
      setIsShownOnTarget(false)
    }
  }

  const handleScrollToForm = () => {
    const offset = getTopOffset(productFormEl) - getStickyHeight()
    window.scrollTo({ top: offset, behavior: 'smooth' })
  }

  const getStickyHeight = () => {
    let stickyHeight = 0
    const anchorSectionEl = select(ANCHOR_CLASS)
    const headerStickyHeight = window.innerWidth < 768 ? 56 : 75
    stickyHeight += headerStickyHeight + getHeight(anchorSectionEl)

    return stickyHeight
  }

  return (
    <Fragment>
      <div
        className={`anchor-section fixed left-0 right-0 top-[56px] z-20 -translate-y-[200%] bg-white opacity-0 transition-all duration-300 ease-in-out md:top-[130px] md-max:border-t xl:top-[75px] ${
          isShownOnTarget && 'anchor-section--scroll-shown !translate-y-0 border-b border-default !opacity-100'
        }`}
      >
        <div className="container flex items-center overflow-auto md-max:px-5">
          <div className="flex h-[56px] items-center md:h-[72px]">
            {itemsData.map((item) => (
              <div
                className={`${
                  currentIndex === item.id &&
                  'relative font-bold text-grey-900 before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:bg-secondary'
                } mr-5 flex h-full cursor-pointer items-center text-sm last:mr-0 md:mr-6`}
                data-anchor-id={item.id}
                onClick={scrollToSection}
              >
                {item.title}
              </div>
            ))}
          </div>

          <button
            aria-label="menu add to cart"
            className="button-primary button-large ml-auto hidden min-h-[40px] pt-[9px] pb-[7px] uppercase md:block"
            onClick={handleScrollToForm}
          >
            {currentVariant && currentVariant.available ? `${translate.general.addToCart} - ${formatMoney(currentVariant.price)}` : `${translate.general.notifyMe}`}
          </button>
        </div>
      </div>
      {isShownOnTarget && (
        <button
          aria-label="menu add to cart"
          className="button-primary button-large fixed bottom-0 left-0 right-0 z-20 ml-auto block rounded-none uppercase md:hidden"
          onClick={handleScrollToForm}
        >
          {currentVariant && currentVariant.available ? `${translate.general.addToCart} - ${formatMoney(currentVariant.price)}` : `${translate.general.notifyMe}`}
        </button>
      )}
    </Fragment>
  )
}

export default AnchorSection
