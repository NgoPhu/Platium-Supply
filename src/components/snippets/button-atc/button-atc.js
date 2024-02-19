import { Fragment } from 'preact'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function ButtonATC({ text, onHandle, loading, disabled = false, buttonClass = '' }) {
  const classCustom = `relative button-primary ${!disabled ? '' : 'text-grey-400'} button-large ${buttonClass}`
  return (
    <button aria-label="add to cart" type="button" className={classCustom} disabled={disabled} onClick={() => onHandle()}>
      {loading ? (
        <LoaderSpin />
      ) : (
        <Fragment>
          {text}
        </Fragment>
      )}
    </button>
  )
}

export default ButtonATC
