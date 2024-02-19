import { useState } from 'preact/hooks'
import { eventProps } from 'helpers/global'

function ProductAvailable() {
  const [currentVariant, setCurrentVariant] = useState(window.productState.initVariant)

  globalEvents.on(eventProps.product.updateVariant, (value) => {
    setCurrentVariant(value)
  })

  return (
    <div className="bg-grey-300 w-fit flex items-center gap-2 h-7 py-1 px-4 rounded-[99px] mr-5">
      <div className={`w-2 h-2 rounded-full ${currentVariant.available ? 'bg-success-bright' : 'bg-warning-content'}`}></div>
      <div className="font-medium text-med">{currentVariant.available ? 'In Stock' : '1-5 Days'}</div>
    </div>
  )
}

export default ProductAvailable
