/* global GlobalEvent */
import { useEffect, useState, useMemo } from 'preact/hooks'
import { eventProps } from 'helpers/global'
import { getMaxQuantityByVariant } from 'helpers/cart'

function useInCart(currentVariant) {
  const [cartItems, setCartItems] = useState(window.GM_STATE.cart.initCart?.items || [])
  const [maxVariantQuantity, setMaxVariantQuantity] = useState(currentVariant?.inventory_quantity || 0)

  const isAvailable = useMemo(() => maxVariantQuantity > 0, [maxVariantQuantity])

  const syncMaxQuantity = (items, variant) => {
    const max = getMaxQuantityByVariant(items, variant)
    setMaxVariantQuantity(max)
  }

  useEffect(() => {
    globalEvents.on(eventProps.cart.update, (items) => {
      setCartItems(items)
      syncMaxQuantity(items, currentVariant)
    })
  }, [])

  useEffect(() => {
    syncMaxQuantity(cartItems, currentVariant)
  }, [currentVariant])

  return { maxVariantQuantity, isAvailable }
}

export default useInCart
