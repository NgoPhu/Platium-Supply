/* global globalEvents */
import { eventProps } from 'helpers/global'
import { useEffect, useState } from 'preact/hooks'
import { getCartProperties, getDisableChangeQuantity, getMaxQuantity, removeCartItem, updateCart, updateCartItem } from 'helpers/cart'

function useCartItem(item, setCart, setIsFetching) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [renderKey, setRenderKey] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const maxQuantity = getMaxQuantity(item)
  const properties = getCartProperties(item.properties)
  const isDisabled = getDisableChangeQuantity(properties)

  const onLoading = (value) => {
    setIsFetching(value)
    setIsLoading(value)
  }

  const refreshCart = async () => {
    const newCart = await updateCart()
    setCart(newCart)
    window.GM_STATE.cart.initCart = newCart
    globalEvents.emit(eventProps.cart.update, newCart.items)
  }

  const onRemove = async () => {
    onLoading(true)
    try {
      await removeCartItem(item.key)
      await refreshCart()
    } catch (error) {
      setRenderKey(renderKey + 1)
    }
    onLoading(false)
  }

  const onChange = async () => {
    onLoading(true)
    try {
      await updateCartItem(item.key, quantity)
      await refreshCart()
    } catch (error) {
      setRenderKey(renderKey + 1)
    }
    onLoading(false)
  }

  const customClassPrice = (() => {
    let classSize = 'text-sm'
    if (item.compare_at_price && item.compare_at_price !== 0) {
      const newClassSize = item.compare_at_price > item.line_price ? ' text-grey-300' : ' text-grey-900'
      classSize += newClassSize
    }
    return classSize
  })()

  useEffect(() => {
    if (item.quantity !== quantity && quantity <= maxQuantity) {
      onChange(quantity)
    }
  }, [quantity])

  return {
    quantity,
    setQuantity,
    isLoading,
    setIsLoading,
    maxQuantity,
    properties,
    isDisabled,
    renderKey,
    onRemove,
    onChange,
    customClassPrice
  }
}

export default useCartItem
