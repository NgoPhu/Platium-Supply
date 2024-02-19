import { useState, useContext } from 'preact/hooks'
import WishlistPageItems from './wishlist-page-items'
import WishlistContext from './context'

export default function WishlistPageGrid({ items, item, setItemList, showItem, setShowItem }) {
  const handleShowItem = (item) => {
    setItemList(item)
    setShowItem(true)
    window.scrollTo(0, 0)
  }
  const { swym, listInfo, isShareWishlistPage } = useContext(WishlistContext)
  const wishlistPageTranslate = window.wishlistPageTranslate

  return (
    <div className={`${showItem ? '' : 'py-4 lg:py-8'}`}>
      {isShareWishlistPage.current && <p className="my-3">You are viewing a read-only list shared by {listInfo.list.userinfo.fname} {listInfo.list.userinfo.lname} ({listInfo.list.userinfo.em}).</p>}
      {!showItem ? (
        <div className="grid gap-4 gird-cols-1 lg:grid-cols-2 lg:gap-8">
          {items.map(item => (
            <div className="cursor-pointer border rounded-[10px] border-default p-4 lg:p-8" onClick={() => handleShowItem(item)}>
              <h3 className="h4 font-body"> { item.lname } </h3>
              <div className="flex justify-between mt-2">
                <span className="text-grey-600">{ item.listcontents.length } {item.listcontents.length === 1 ? 'Product' : 'Products'}</span>
                <span className="underline capitalize text-secondary hover:cursor-pointer">view list</span>
              </div>
              {item.listcontents.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  { item.listcontents.slice(0, 3).map(product => (
                    <div className="block w-full aspect-1">
                      <img src={product.iu} alt={product.dt} className="object-cover w-full h-full transition hover:zoom" />
                    </div>
                  ))}
                </div>
              ) : <p className="pt-8 text-base text-grey-900">{wishlistPageTranslate.emptyList}</p>}
            </div>
          ))}
        </div>
      ) : (
        <WishlistPageItems item={item} items={items} setShowItem={setShowItem} setItem={setItemList} />
      )}
    </div>
  )
}
