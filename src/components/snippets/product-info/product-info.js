import { useState } from 'preact/hooks'
import { eventProps } from 'helpers/global'

function ProductInfo() {
  const [currentVariant, setCurrentVariant] = useState(window.productState.initVariant)
  const currentProduct = window.productState.initProduct

  globalEvents.on(eventProps.product.updateVariant, (value) => {
    setCurrentVariant(value)
  })

  return (
    <div>
      <h1 class="text-xl font-bold font-body text-grey-900 mb-2 md:text-3xl w-full lg:max-w-[399px]">{currentProduct.title}</h1>
      <p className="font-sans text-xs text-grey-900">SKU: {currentVariant.sku}</p>
    </div>
  )
}

export default ProductInfo
