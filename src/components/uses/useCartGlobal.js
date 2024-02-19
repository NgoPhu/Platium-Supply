import { useState } from 'preact/hooks'

function useCartGlobal() {
  const [cart, setCart] = useState(window.GM_STATE.cart.initCart)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return {
    cart,
    setCart,
    isFetching,
    setIsFetching,
    isLoaded,
    setIsLoaded
  }
}

export default useCartGlobal
