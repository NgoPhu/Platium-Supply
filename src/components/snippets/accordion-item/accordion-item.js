import { useState, useRef, useEffect } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
function AccordionItem({ defaultActive, heading, content, subContent, wrapperClass, headingIcon = false, iconName, titleClass, isOverflow = true, isMaxHeight = true, classIcon }) {
  const contentRef = useRef(null)
  const [active, setActive] = useState(false)
  const [style, setStyle] = useState('max-height: 0')

  useEffect(() => {
    if (defaultActive && !active) {
      onToggle()
    } else if (!defaultActive && active) {
      setActive(false)
      setStyle('max-height: 0')
    }
  }, [defaultActive])

  const onToggle = () => {
    const maxHeight = !isMaxHeight || contentRef.current.scrollHeight < 300 ? contentRef.current.scrollHeight : 300
    if (!active) {
      setStyle(`max-height: ${maxHeight}px`)
    } else {
      setStyle('max-height: 0')
    }
    setActive(!active)
    contentChange(contentRef.current)
  }

  const contentChange = (item) => {
    const config = { attributes: true, childList: true, subtree: true }

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          const heightContent = mutation.target.parentElement.scrollHeight
          contentRef.current.style.maxHeight = heightContent + 'px'
        }
      }
    }

    const observer = new MutationObserver(callback)

    observer.observe(item, config)
  }

  useEffect(() => {
    if (active && defaultActive) {
      const maxHeight = !isMaxHeight || contentRef.current.scrollHeight < 300 ? contentRef.current.scrollHeight : 300
      setStyle(`max-height: ${maxHeight}px`)
    }
  }, [content, defaultActive])

  return (
    <div className={`accordion-item ${wrapperClass}`} open={active}>
      <button type="button" className={`accordion-item-title ${titleClass}`} onClick={onToggle}>
        <div class="mr-8 flex-1">
          <div className="flex items-center">
            {headingIcon && <Icon name={iconName} className="w-5 h-5 mr-3" />}
            {heading}
          </div>
          {subContent}
        </div>
        <span class="accordion-item-icon">
          <Icon viewBox="0 0 20 20" name="icon-chevron-down-outline-2" className={`accordion-item-icon-open ${classIcon}`} />
          <Icon viewBox="0 0 20 20" name="icon-chevron-down-outline-2" className={`accordion-item-icon-close rotate-180 ${classIcon}`} />
        </span>
      </button>
      <div ref={contentRef} className={`${isOverflow ? 'scrollbar-custom max-h-[300px] overflow-y-auto ' : ''} accordion-item-description`} style={style}>
        {content}
      </div>
    </div>
  )
}

export default AccordionItem
