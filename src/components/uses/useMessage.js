import { useEffect, useState, useCallback } from 'preact/hooks'
import Icon from 'snippets/icon/icon'

function useMessage() {
  const [message, setMessage] = useState(null)
  const [duration, setDuration] = useState(null)

  const markupMessage = (text, content, customClass, customIcon) => {
    return (
      <div className={`notice-main inline-flex overflow-hidden ${customClass}`}>
        {customIcon && (
          <button type="button" class="notice-main-icon">
            {customIcon}
          </button>
        )}
        {(text || content) && (
          <div className="notice-main-content">
            {text && <h4>{text}</h4>}
            {content && <p>{content}</p>}
          </div>
        )}
      </div>
    )
  }

  const renderMessage = (text, content = '', type = 'standard', duration) => {
    if (!text && !content) {
      return ''
    }

    if (duration) {
      setDuration(duration)
    }

    let customClass = ''
    let customIcon = ''

    switch (type) {
      case 'success':
        customClass = 'notice-success'
        customIcon = <Icon className="h-6 w-6" name="icon-check" viewBox="0 0 16 16" />
        break
      case 'warning':
        customClass = 'notice-warning'
        customIcon = <Icon className="h-6 w-6" name="icon-warning" viewBox="0 0 24 24" />
        break
      case 'error':
        customClass = 'notice-error'
        customIcon = <Icon className="h-6 w-6" name="icon-fail" viewBox="0 0 24 24" />
        break
      default:
        customClass = ''
        customIcon = <Icon className="h-6 w-6" name="icon-check" viewBox="0 0 24 24" />
        break
    }

    return markupMessage(text, content, customClass, customIcon)
  }

  const clearMessage = () => {
    setMessage(null)
  }

  useEffect(() => {
    if (duration) {
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }, [duration])

  const initMessage = useCallback((text, content, type, duration) => {
    const messageHTML = renderMessage(text, content, type, duration)
    if (messageHTML) {
      setMessage(messageHTML)
    }
  }, [])

  return { message, initMessage, clearMessage }
}

export default useMessage
