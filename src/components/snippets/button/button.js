import { Fragment } from 'preact'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function Button({ type = 'button', text = 'Button', icon = '', loading = false, className = 'button-primary', disabled = false, onHandle = () => {} }) {
  return (
    <button type={type} className={className} onClick={() => onHandle()} disabled={disabled}>
      {!loading ? (
        <Fragment>
          {icon}
          {text}
        </Fragment>
      ) : (
        <LoaderSpin />
      )}
    </button>
  )
}

export default Button
