import SwymWishlistServices from '@/components/uses/useSwymWishlist'
import register from 'preact-custom-element'
import { useMemo, useState, useEffect } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import { eventProps } from 'helpers/global'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

function WishlistHeader() {
  const wishlistInstance = new SwymWishlistServices()
  const [count, setCount] = useState(0)

  const fetchWishlist = async () => {
    let count = 0
    const lists = await wishlistInstance.getAllList()
    if (!lists) return []
    lists.forEach(item => (count += item.listcontents.length))
    setCount(count)
    globalEvents.emit(eventProps.wishlist.list, lists)
  }

  useMemo(() => {
    window.SwymCallbacks.push(fetchWishlist)
    window.SwymCallbacks.push(() => _swat.evtLayer.addEventListener(_swat.JSEvents.regidRefreshed, fetchWishlist))
  }, [])

  useEffect(() => {
    globalEvents.on(eventProps.wishlist.change, async (value) => {
      if (value) {
        await fetchWishlist()
      }
    })
  }, [])

  useEffect(() => {
    globalEvents.on(eventProps.wishlist.update, async (value) => {
      if (value) {
        await fetchWishlist()
      }
    })
  }, [])

  return (
    <a href="/pages/wishlist" className='lg:border lg:flex lg:items-center lg:gap-2 lg:px-4 lg:py-3 lg:rounded-lg'>
      <Icon name="icon-heart-outline" viewBox="0 0 28 28" className="w-7 h-7 text-secondary" />
      <span className='font-semibold text-grey-900 text-med lg-max:hidden'>{count}</span>
    </a>
  )
}

register(WishlistHeader, 'wishlist-header')
