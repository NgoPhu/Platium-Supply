import { useEffect, useRef, useState } from 'preact/hooks'
import { initValidate } from 'helpers/validate'
import { formatMoney } from 'uses/useShopify'
import { eventProps } from 'helpers/global'
import { addCartItem, addMutipleCartItems, clearCart, getCart, removeCartItem, updateCart } from 'helpers/cart'
import TextInput from 'snippets/text-input/text-input'
import SelectInput from 'snippets/select-input/select-input'
import { delay } from 'helpers/utils'
import useCartGlobal from 'uses/useCartGlobal'

function EstimateShipping({ classInner }) {
  const isCartPage = window.GM_STATE.cart.templateName === 'cart'
  const [currentVariant, setCurrentVariant] = useState(!isCartPage ? window.productState.initVariant : null)
  const formRef = useRef(null)
  const [notice, setNotice] = useState('')
  const [shippingRate, setShippingRate] = useState('')
  const { setCart } = useCartGlobal()
  const className = "relative text-grey-900 pl-7 font-bold after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-2.5 after:w-1.5 after:h-1.5 after:rounded after:bg-grey-900"

  const provincesAustralia = [
    { name: 'Australian Capital Territory', value: 'Australian Capital Territory' },
    { name: 'New South Wales', value: 'New South Wales' },
    { name: 'Northern Territory', value: 'Northern Territory' },
    { name: 'Queensland', value: 'Queensland' },
    { name: 'South Australia', value: 'South Australia' },
    { name: 'Tasmania', value: 'Tasmania' },
    { name: 'Victoria', value: 'Victoria' },
    { name: 'Western Australia', value: 'Western Australia' }
  ]
  const onSubmit = async () => {
    const { postcode, suburb, state } = Object.fromEntries((new FormData(formRef.current).entries()))
    let url = `${window.location.origin}/cart/shipping_rates.json?shipping_address[zip]=${postcode}&shipping_address[country]=Australia&shipping_address[city]=${suburb}`
    if (state) {
      url += `&shipping_address[province]=${state}`
    }
    !isCartPage && await clearItemInCart()
    fetch(url)
      .then(res => {
        if (res.status === 422) {
          setNotice('Please enter valid postcode, suburb or state')
        } else {
          setNotice('')
        }
        return res.json()
      })
      .then(data => data?.shipping_rates?.map(item => setShippingRate(item)))
      .catch(error => console.error(error))
    !isCartPage && await addCartOld()
  }

  const clearItemInCart = async () => {
    await clearCart()
    globalEvents.on(eventProps.product.updateVariant, (value) => {
      setCurrentVariant(value)
    })
    const properties = {}
    await addCartItem(currentVariant.id, properties, 1)
  }

  const addCartOld = async () => {
    const dataCartOld = JSON.parse(sessionStorage.getItem('item-cart'))
    const cartDatas = await getCart()
    await removeCartItem(cartDatas.items[0].key)
    await clearCart()
    if (dataCartOld) {
      const body = {
        items: dataCartOld.map((i) => {
          return {
            id: i.id,
            quantity: i.quantity,
            properties: i.properties
          }
        })
      }
      await addMutipleCartItems(body)
    }
    const newCart = await updateCart()
    setCart(newCart)
    await delay(500)
    window.GM_STATE.cart.initCart = newCart
    globalEvents.emit(eventProps.cart.update, newCart.items)
  }

  useEffect(() => {
    initValidate(formRef.current, true).onSuccess(onSubmit)
  }, [])

  return (
    <form id="Estimate-Shipping" ref={formRef} className={`estimate-shipping mt-4 bg-white lg:mt-6 ${classInner}`}>
      <div className="estimate-shipping-content grid grid-cols-2 px-4 py-5 gap-4 lg:p-8 lg:pb-6">
        <TextInput
          id="postcode"
          type="text"
          className="peer input no-autocomplete text-grey-900 placeholder:text-transparent focus:shadow-0 focus:outline-none"
          placeholder="Your Postcode"
          label="Your Postcode"
          required={true}
          name="postcode"
        />
        <TextInput
          id="suburb"
          type="text"
          className="peer input no-autocomplete text-grey-900 placeholder:text-transparent focus:shadow-0 focus:outline-none"
          placeholder="Your Suburb"
          label="Your Suburb"
          required={true}
          name="suburb"
        />
        <SelectInput
          id="state"
          type="select"
          items={provincesAustralia}
          className="peer input no-autocomplete text-grey-900 placeholder:text-transparent focus:shadow-0 focus:outline-none"
          label="Select State"
          name="state"
        />
        <button type="submit" className="button-primary h-12 w-full">Estimate</button>
        {notice && <p className="text-base col-span-full text-error-content">{notice}</p>}
      </div>
      {shippingRate && (
        <div className="estimate-shipping-footer border-t px-4 py-5 lg:p-8 lg:pt-6">
          <p className="text-grey-600">We’ve found the following shipping rates for your address:</p>
          <div className="mt-3 list-style-inside">
            <div className="flex justify-between mb-3 last:mb-0">
              <span className={className}>{shippingRate.name ? 'Standard Shipping' : 'Express Shipping'}</span>
              <span className="text-grey-600 text-right">{formatMoney(shippingRate.price)}</span>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default EstimateShipping
