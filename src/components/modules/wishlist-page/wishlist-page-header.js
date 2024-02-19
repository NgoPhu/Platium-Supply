import Icon from 'snippets/icon/icon'
import WishlistSaveList from './wishlist-save-list'
import { Fragment } from 'preact'

export default function WishlistPageHeader () {
  const translate = window.wishlistTranslate
  const customerState = window.GM_STATE.customer

  return (
    <Fragment>
      <div className="flex items-center justify-between py-8 border-b">
          {customerState.logged ? (
            <a href="/account/login?redirect=wishlist" className="flex items-center no-underline cursor-pointer link group text-grey-900 hover:text-primary">
              <Icon name="icon-user-circle" className="mr-2 w-7 h-7 text-secondary"/>
              {customerState.name}
            </a>
          ) : (
            <modal-opener data-id="wishlist-save-list-modal">
              <button className="flex items-center no-underline cursor-pointer link group text-grey-900 hover:text-primary">
                <Icon name="icon-user-circle" className="mr-2 w-7 h-7 text-secondary"/>
                {translate?.wishlistGuest}
              </button>
            </modal-opener>
          )}
          {
            !customerState.logged && (
              <modal-opener data-id="wishlist-save-list-modal">
                {translate?.wishlistSave && (
                  <div className="flex items-center cursor-pointer link group text-secondary hover:text-primary">
                    <Icon name="icon-bookmark-outline" className="w-5 h-5 mr-2 text-secondary group-hover:text-primary" viewBox="0 0 20 20" />
                    {translate?.wishlistSave}
                  </div>
                )}
              </modal-opener>
            )
          }
      </div>
      <WishlistSaveList />
    </Fragment>
  )
}
