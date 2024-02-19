import Price from 'snippets/price/price'
import { useState, useMemo } from 'preact/hooks'
import Image from 'snippets/image/image'
import Icon from 'snippets/icon/icon'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import { eventProps } from 'helpers/global'
import { addCartItem } from 'helpers/cart'
import PlpCardPrice from 'snippets/plp-card-price/plp-card-price'

export default function WishlistCard({ item, swym, isShareWishlistPage, setShowItem }) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const buttonText = useMemo(() => (item.cprops.available ? 'Add to cart' : 'Sold out'), [item.cprops.available])

  const handleRemove = async (e) => {
    e.preventDefault()

    try {
      setIsRemoving(true)
      const res = await swym.removeFromWishlist(item.lid, item)

      if (res) {
        setIsRemoving(false)
        globalEvents.emit(eventProps.wishlist.change, res)
        setShowItem(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addToCart = async () => {
    setIsAdding(true)
    const cartItem = await addCartItem(item.epi, {}, 1)
    if (cartItem) {
      globalEvents.emit(eventProps.cart.add, cartItem)
    }
    setIsAdding(false)
  }

  return (
    <div className={`wishlist-card relative flex flex-col ${isRemoving ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {
        isRemoving && (
          <div className='absolute top-0 left-0 z-30 w-full h-full'>
            <LoaderSpin width='6' height='6' wrapperClass='bg-transparent' spinClass='border-t-secondary' />
          </div>
        )
      }
      <div className="relative mb-4 wishlist-card-image lg:mb-6">
        {!isShareWishlistPage.current && <button className='absolute top-0 right-0 z-10 w-8 h-8 p-1 bg-white rounded-full' type="button" onClick={handleRemove}>
          <Icon name="icon-close-outline-1" className="w-6 h-6 text-grey-600" />
        </button>}
        <a href={item.du} title={item.dt} className='block w-full'>
          <img src={item.iu} alt={item.dt} className="object-cover w-full h-full transition hover:zoom" />
        </a>
      </div>
      <div className='flex flex-col flex-1'>
          <Price
            price={item.pr * 100}
            originalPrice={item.cprops.comparePrice}
            className="flex flex-row-reverse items-center justify-end gap-2 plp-card-price"
            classSize="text-sm font-body font-normal text-grey-900"
            classColor="text-lg text-primary !font-bold font-body md:text-xl"
          />
        <div className='flex-1 mt-2'>
          <h3>
            <a href={item.du} title={item.dt} className='text-sm text-grey-1000 no-underline hover:underline wishlist-card-title lg:h-[78px] lg:text-custom-5'>
              {item.dt}
            </a>
          </h3>
        </div>
        <div className='flex flex-col mt-auto'>
          <button className="relative w-full mt-4 button-secondary button-icon button-add-to-bag lg-max:px-3 lg:px-[18px] lg:mt-[18px] normal-case" disabled={!item.cprops.available} onClick={addToCart}>
          {isAdding ? <LoaderSpin wrapperClass='bg-transparent' spinClass='border-t-secondary' /> : (
            <span dangerouslySetInnerHTML={{ __html: buttonText }}></span>
          )}
        </button>
        </div>
      </div>
    </div>
  )
}
