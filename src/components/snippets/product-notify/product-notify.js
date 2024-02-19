import { useEffect, useRef, useState } from 'preact/hooks'
import TextInput from 'snippets/text-input/text-input'
import { initValidate } from 'helpers/validate'

function ProductNotify(props) {
  const [notify, setNotify] = useState('')
  const [notifyState, setNotifyState] = useState('')
  const formProductNotify = useRef()
  let notifyMessage = ''

  useEffect(() => {
    initValidate(formProductNotify.current, true).onSuccess(onSubmit)
  }, [])

  notify &&
    notifyState &&
    (notifyMessage = (
      <notice-main className={`notice-main mt-3 notice-main-${notifyState}`}>
        <button type="button" className="notice-main-icon">
          <svg viewBox="0 0 24 24" className="icon" fill="none" stroke-width="2" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" id="icon-faild">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
        <div className="notice-main-content">{notify}</div>
      </notice-main>
    ))

  const onSubmit = async () => {
    const { email } = Object.fromEntries(new FormData(formProductNotify.current).entries())
    const data = [email, props.variant.value.id, props.product.value.id]

    if (!window.BIS) return
    try {
      const res = await window.BIS.create(...data)
      if (res.status === 'OK') {
        setNotifyState('success')
        setNotify(res.message)
      } else {
        setNotifyState('error')
        setNotify(res.errors.base)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="rounded border border-default bg-grey-100 px-6 py-5">
      <strong className="text-base font-bold text-grey-900">{translate.product.notifyMeWhenAvailable}</strong>
      <p className="mt-1 text-sm">{translate.product.subtextNotifyMe}</p>
      <form id="ProductNotify" className="mt-4 flex flex-col items-start sm:flex-row" ref={formProductNotify}>
        <TextInput
          classWrap="w-full md:max-w-[152px] xl:max-w-[172px]"
          type="email"
          id="product-notify-input"
          placeholder="Email address"
          autocomplete={true}
          name="email"
        />
        <button type="submit" className="button-primary mt-4 w-full px-1 sm:mt-0 sm:ml-4 md:flex-1">
          {translate.product.notifyMe}
        </button>
      </form>
      {notifyMessage}
    </div>
  )
}

export default ProductNotify
