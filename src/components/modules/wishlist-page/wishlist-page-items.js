import { Fragment } from 'preact'
import { useState, useContext, useRef } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import WishlistCard from './wishlist-card'
import WishlistContext from './context'
import useClickOutSide from 'uses/useClickOutSide'
import SwymWishlistServices from '@/components/uses/useSwymWishlist'
import { eventProps } from 'helpers/global'
import WishlistPageEmpty from './wishlist-page-empty'

export default function WishlistPageItems({ items, item, setShowItem, setItem }) {
  const { swym, listInfo, isShareWishlistPage } = useContext(WishlistContext)

  const wishlistTranslate = window.wishlistTranslate

  return (
    <Fragment>
      {!isShareWishlistPage.current && item.listcontents.length > 0 && (
        <div className="flex justify-between pb-5 mb-5 border-b border-default lg:mb-6">
          <WishlistItemDropDown items={items} item={item} setItem={setItem} />
          <WishlistAction item={item} setShowItem={setShowItem} />
        </div>
      )}
      {isShareWishlistPage.current && <p className="mb-8 text-base font-normal text-grey-900">{wishlistTranslate.shareWishlist} {listInfo.list.userinfo.fname} {listInfo.list.userinfo.lname} ({listInfo.list.userinfo.em}).</p>}
      <WishlistListProduct item={item} setShowItem={setShowItem} isShareWishlistPage={isShareWishlistPage} />
    </Fragment>
  )
}

function WishlistItemDropDown({ items, item, setItem }) {
  const [isActive, setIsActive] = useState(false)
  const listDropDownEl = useRef(null)

  const handleClickOutSide = () => {
    setIsActive(false)
  }

  useClickOutSide(listDropDownEl, handleClickOutSide)

  const handleActive = () => {
    setIsActive(!isActive)
  }

  const handleChange = (item) => {
    setItem(item)
    setIsActive(false)
  }

  return (
    <Fragment>
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="w-12 h-12 p-1 overflow-hidden bg-white rounded-full">
            <img src={item.listcontents[0].iu} alt={item.listcontents[0].dt} className="object-cover w-full h-full" />
          </div>
          <div className="relative z-20 ml-4" ref={listDropDownEl}>
            <span className="font-sans text-xs text-grey-600">List</span>
            <button className="flex items-center text-base font-bold font-body text-grey-900" type="button" onClick={handleActive}>
              {item.lname}
              {!isActive && <Icon name="icon-chevron-down-outline-2" className="w-5 h-5 ml-1 text-grey-500" />}
              {isActive && <Icon name="icon-chevron-down-outline-2" className="w-5 h-5 ml-1 rotate-180 text-grey-500" />}
            </button>
            <div className={`absolute left-0 flex flex-col bg-white top-14 w-[144px] border border-default px-3 py-2 ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              {items.map(item => (
                <div className="py-1 text-sm cursor-pointer hover:underline" onClick={() => handleChange(item)}>{item.lname}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

function WishlistListProduct({ item, setShowItem }) {
  const { swym, isShareWishlistPage } = useContext(WishlistContext)
  const handleBack = () => {
    setShowItem(false)
  }

  return (
    <div>
      {!isShareWishlistPage.current && (
        <div className={`${item.listcontents.length === 0 && 'flex justify-between'}`}>
          <button className="flex items-center mb-5 link text-secondary hover:text-secondary-hover md:mb-6" onClick={handleBack}>
            <Icon name="icon-chevron-back-outline" className="w-5 h-5 mr-1.5" />
            Back
          </button>
          {item.listcontents.length === 0 && <WishlistAction item={item} setShowItem={setShowItem} />}
        </div>
      )}
      {
        item.listcontents.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 md:gap-x-8 md:gap-y-12">
            {item.listcontents.map(product => (
              <WishlistCard item={product} swym={swym} key={item.id} setShowItem={setShowItem} isShareWishlistPage={isShareWishlistPage} />
            ))}
          </div>
        ) : (
          <WishlistPageEmpty />
        )
      }
    </div>
  )
}

function WishlistAction({ item, setShowItem }) {
  const wishlistInstance = new SwymWishlistServices()
  const [isActive, setIsActive] = useState(false)
  const actionButton = useRef(null)

  const handleActive = () => {
    setIsActive(!isActive)
  }

  const handleClickOutSide = () => {
    setIsActive(false)
  }

  useClickOutSide(actionButton, handleClickOutSide)

  const isLogged = window.GM_STATE.customer.logged

  const removeList = async (e) => {
    e.preventDefault()

    try {
      const res = await wishlistInstance.deleteList(item.lid)

      if (res) {
        globalEvents.emit(eventProps.notice.global, {
          type: 'success',
          content: 'List removed in wishlist',
          classCustom: 'notice-main-wishlist'
        })
        globalEvents.emit(eventProps.wishlist.change, res)
        setShowItem(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="relative" ref={actionButton}>
      <button type="button" onClick={handleActive}>
        <Icon name="icon-elipsis-outline" className="w-6 h-6 text-grey-500" />
      </button>
      <div className={`absolute right-0 flex flex-col bg-white top-7 w-[144px] border border-default px-3 py-2 ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {
          isLogged && item.listcontents.length > 0 && (
            <modal-opener data-id="wishlist-share-modal">
              <div className="flex items-center mb-4 cursor-pointer">
                <Icon name="icon-share" className="w-6 h-6 mr-1.5" />
                Share
              </div>
            </modal-opener>
          )
        }
        <button className="flex items-center" type="button" onClick={removeList}>
          <Icon name="icon-trash" className="w-6 h-6 mr-1.5" />
          Delete List
        </button>
      </div>
    </div>
  )
}
