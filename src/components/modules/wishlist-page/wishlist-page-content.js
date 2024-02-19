import WishlistPageEmpty from './wishlist-page-empty'
import WishlistPageGrid from './wishlist-page-grid'
import WishlistPageItems from './wishlist-page-items'

export default function WishlistPageContent({ items, itemList, setItemList, showItem, setShowItem, isShareWishlistPage }) {
  return (
    <div className="wishlist-page-content">
      {!isShareWishlistPage.current ? (
        items?.length > 0 ? (
          <WishlistPageGrid
            items={items}
            item={itemList}
            setItemList={setItemList}
            showItem={showItem}
            setShowItem={setShowItem} />
        ) : <WishlistPageEmpty />
      ) : (
        items?.items?.length > 0 &&
        <WishlistPageItems
          item={items.list}
          items={items?.items}
          setShowItem={setShowItem}
          setItem={setItemList}
        />
      )
      }
    </div>
  )
}
