import SwymWishlistServices from 'uses/useSwymWishlist'
import register from 'preact-custom-element'
import { useEffect, useState, useRef } from 'preact/hooks'
import WishlistContext from './context'
import WishlistPageContent from './wishlist-page-content'
import WishlistPageHeader from './wishlist-page-header'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import { eventProps } from 'helpers/global'
import Icon from 'snippets/icon/icon'
import WishlistShare from './wishlist-share'
import WishlistSaveList from './wishlist-save-list'

function WishlistPage() {
  const swym = new SwymWishlistServices()
  const [isLoading, setIsLoading] = useState(true)
  const [showItem, setShowItem] = useState(false)
  const [listInfo, setListInfo] = useState(null)
  const [itemList, setItemList] = useState(null)
  const isShareWishlistPage = useRef(window.location.pathname.includes('swym-share-wishlist'))
  const customerState = window.GM_STATE.customer
  const translate = window.wishlistTranslate

  const getShareWishlistItem = async () => {
    const lid = await swym.getListShareId()
    const list = await swym.fetchListDetails(lid)

    if (list) {
      updateList(list)
    }
  }

  const updateList = (value) => {
    setListInfo(value)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isShareWishlistPage.current) {
      globalEvents.on(eventProps.wishlist.list, updateList)
    } else {
      window.SwymCallbacks.push(getShareWishlistItem)
      setShowItem(true)
    }
  }, [])

  return (
    <WishlistContext.Provider value={{ swym, listInfo, isShareWishlistPage }}>
      <div className='container pb-8 lg:pb-[72px]'>
        {isLoading ? (
          <div className='relative py-8 text-center'>
            <LoaderSpin width='6' height='6' wrapperClass='bg-transparent' />
          </div>
        ) : (
          <div className="wishlist-page">
            <div className="flex items-center justify-between pt-4 pb-4 lg:pb-10">
              {translate?.wishlistTitle && (
                <div className="flex items-center gap-6">
                  <h1 className="text-xl font-bold lg:text-3xl text-grey-900 font-body">{translate?.wishlistTitle}</h1>
                  {customerState.logged && !isShareWishlistPage.current && (
                    <a href="/account" className="flex items-center w-fit px-4 py-2 bg-white rounded-[10px] border border-custom md-max:hidden">
                      <Icon name="icon-chevron-left" className="w-4 h-4 mr-2 text-primary"/>
                      Back to account
                    </a>
                  )}
                </div>
              )}
              {customerState.logged && showItem && (
                <a href="/account" className="flex items-center no-underline cursor-pointer link group text-grey-900 hover:text-primary">
                  <Icon name="icon-user-circle" className="mr-2 w-7 h-7 text-secondary"/>
                  {customerState.name}
                </a>
              )}
              {
                !customerState.logged && isShareWishlistPage.current && (
                  <modal-opener data-id="wishlist-save-list-modal">
                    <button className="flex items-center no-underline cursor-pointer link group text-grey-900 hover:text-primary">
                      <Icon name="icon-user-circle" className="mr-2 w-7 h-7 text-secondary"/>
                      {translate?.wishlistGuest}
                    </button>
                  </modal-opener>
                )
              }
            </div>
            {customerState.logged && !isShareWishlistPage.current && (
              <a href="/account" className="flex items-center w-full justify-center px-4 py-2 bg-white rounded-[10px] border border-custom md:hidden md-max:mb-5">
                <Icon name="icon-chevron-left" className="w-4 h-4 mr-2 text-primary"/>
                Back to account
              </a>
            )}
            <div className={`${!isShareWishlistPage.current && !showItem ? 'bg-white border border-grey-300 rounded-[10px] shadow-base px-4 lg:px-8' : ''}`}>
              {!showItem && <WishlistPageHeader />}
              <WishlistPageContent items={listInfo} itemList={itemList} setItemList={setItemList} showItem={showItem} setShowItem={setShowItem} isShareWishlistPage={isShareWishlistPage} />
            </div>
          </div>
        )}
      </div>
      {window.GM_STATE.customer.logged && <WishlistShare item={itemList} />}
      {!customerState.logged && isShareWishlistPage.current && <WishlistSaveList />}
    </WishlistContext.Provider>
  )
}

register(WishlistPage, 'wishlist-page')
