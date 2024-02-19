/* global globalEvents */
import { useEffect, useState, useMemo } from 'preact/hooks'
import { eventProps } from 'helpers/global'
import Icon from 'snippets/icon/icon'

function NoticeGlobal() {
  const [type, setType] = useState('standard')
  const [content, setContent] = useState('')
  const [classCustom, setClassCustom] = useState('')
  const [isDisplayed, setIsDisplayed] = useState(false)

  useEffect(() => {
    globalEvents.on(eventProps.notice.global, (value) => {
      if (value.type) {
        setType(value.type)
      }
      if (value.content) {
        setContent(value.content)
      }
      setIsDisplayed(true)
      if (value.duration) {
        setTimeout(() => {
          setIsDisplayed(false)
        }, value.duration)
      } else {
        setTimeout(() => {
          setIsDisplayed(false)
        }, 5000)
      }
      if (value.classCustom) {
        setClassCustom(value.classCustom)
      }
    })
  }, [])

  const className = useMemo(() => {
    let classType = ''
    switch (type) {
      case 'success':
        classType = 'notice-main-success'
        break
      case 'error':
        classType = 'notice-main-error'
        break
      case 'warning':
        classType = 'notice-main-warning'
        break
    }
    return classType
  }, [type])

  return (
    <div className={`fixed left-0 right-0 bottom-20 z-30 mx-auto flex max-w-[400px] justify-center ${classCustom}`}>
      <div className="container text-center">
        {isDisplayed && (
          <div className={`notice-main inline-flex overflow-hidden ${className}`}>
            <button type="button" class="notice-main-icon" onClick={() => { setIsDisplayed(false) }}>
              {type === 'success' && <Icon className="w-6 h-6 text-white icon-success" name="icon-close-outline-1" viewBox="0 0 24 24" />}
              {type === 'warning' && <Icon className="w-6 h-6 text-white" name="icon-faild" viewBox="0 0 24 24" />}
              {type === 'standard' && <Icon className="w-6 h-6 text-white" name="icon-faild" viewBox="0 0 24 24" />}
              {type === 'error' && <Icon className="w-6 h-6 text-white" name="icon-faild" viewBox="0 0 24 24" />}
            </button>
            <div class="notice-main-content bg-white">{content}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoticeGlobal
