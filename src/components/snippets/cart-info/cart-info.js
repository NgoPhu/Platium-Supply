import { useState, useRef } from 'preact/hooks'

const IGNORE_PROPERTIES = ['timestamp']

function CartInfo({ infos, properties }) {
  const content = useRef(null)
  const [active, setActive] = useState(false)
  const [style, setStyle] = useState('height: 0')
  const [hasContent, setHasContent] = useState(false)

  const toggleActive = () => {
    if (!active) {
      setStyle(`height: ${content.current.scrollHeight}px`)
    } else {
      setStyle('height: 0')
    }
    setActive(!active)
  }

  const getLineProperty = (property) => {
    if (IGNORE_PROPERTIES.some((item) => property.name.includes(item))) {
      return ''
    }
    return renderLineProperty(`${property.name}: ${property.key}`)
  }

  const renderLineProperty = (text) => {
    setHasContent(true)
    return <span className="mb-2 block text-xs tracking-normal text-grey-900">{text}</span>
  }

  return (
    <div>
      {infos.map((info) => (
        <span className="mt-0.5 text-sm text-grey-500">{info.name}</span>
      ))}
      {properties.length > 0 && (
        <div className={`mt-0.5 flex flex-col ${hasContent ? 'block' : 'hidden'}`}>
          <div ref={content} className="overflow-hidden transition-[height]" style={style}>
            {properties.map((property) => getLineProperty(property))}
          </div>
          <button type="button" className="flex items-center text-sm text-grey-500" onClick={toggleActive}>
            <svg className="mr-0.5 h-4 w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              {active ? (
                <path id="icon-minus" d="M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
              ) : (
                <path id="icon-plus" d="M10 4.375v11.25M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              )}
            </svg>
            {active ? translate.cart.hide_selections : translate.cart.view_selections}
          </button>
        </div>
      )}
    </div>
  )
}

export default CartInfo
