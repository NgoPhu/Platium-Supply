import { Fragment } from 'preact'
import { on } from 'helpers/dom'
import { useEffect, useState, useRef } from 'preact/hooks'
import Icon from '../icon/icon'
import LoaderSpin from '../loader-spin/loader-spin'

function QuantityInput({ min = 0, max = 9999, quantity, setQuantity, disabled = false, classWrap, classButton = 'w-12 h-14 p-0', isLoading = false }) {
  const [value, setValue] = useState(quantity)
  const [message, setMessage] = useState(null)
  const inputRef = useRef(null)

  const onChange = (count) => {
    const current = value + count
    if (current >= min) {
      setValue(current)
      setQuantity(current)
    }
  }

  const onValidate = (value) => {
    return /^\d+$/.test(value)
  }

  const onChangeInput = (e) => {
    e.preventDefault()
    const currentQuantity = parseInt(e.target.value)
    const isValidated = onValidate(currentQuantity)

    if (isNaN(currentQuantity)) {
      inputRef.current.value = value
      return
    }

    setValue(currentQuantity)

    if (inputRef && inputRef.current) {
      inputRef.current.value = currentQuantity
    }

    if (!isValidated) {
      if (currentQuantity !== 0 && currentQuantity < min) {
        setMessage('Enter a positive numbers')
      } else {
        setMessage('Enter only number')
      }
      return
    }

    setQuantity(currentQuantity)

    if (currentQuantity <= max && currentQuantity >= 0) {
      setMessage(null)
    } else {
      changeMessage()
    }
  }

  const changeMessage = () => {
    if (max > 1) {
      setMessage(`We have ${max} items`)
    } else {
      setMessage('We have only 1 item')
    }
  }

  useEffect(() => {
    if (inputRef && inputRef.current) {
      on(
        'keydown',
        (event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onChangeInput(event)
          }
        },
        inputRef.current
      )
    }
  }, [isLoading])

  return (
    <Fragment>
      <div className={`relative flex h-14 items-center justify-between overflow-hidden rounded-full border border-primary ${classWrap}`}>
        <button
          type="button"
          name="minus"
          className={`flex items-center justify-end text-secondary ${classButton} ${
            value <= min || disabled || isLoading ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
          }`}
          disabled={value < min || disabled || isLoading}
          onClick={() => onChange(-1)}
          aria-label="previous-page"
        >
          <Icon viewBox="0 0 20 20" name="icon-minus" className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
        </button>
        <div className="relative w-[26px]">
          {!isLoading ? (
            <input
              type="number"
              ref={inputRef}
              value={value}
              className="w-[26px] border-none p-0 text-center text-sm text-grey-900 !shadow-none !ring-0"
              min={min}
              max={max}
              onChange={onChangeInput}
              onBlur={onChangeInput}
              step="1"
              readonly={disabled}
              aria-label="page-number"
            />
          ) : (
            <LoaderSpin width="4" height="4" />
          )}
        </div>
        <button
          type="button"
          name="plus"
          className={`flex items-center justify-start text-secondary ${classButton} ${
            value < min || value >= max || disabled || isLoading ? 'pointer-events-none cursor-not-allowed opacity-50' : ''
          }`}
          disabled={value < min || value === max || disabled || isLoading}
          onClick={() => onChange(1)}
          aria-label="next-page"
        >
          <Icon viewBox="0 0 20 20" name="icon-plus" className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
        </button>
      </div>
      {message && <span className="text-xs text-error-content">{message}</span>}
    </Fragment>
  )
}

export default QuantityInput
