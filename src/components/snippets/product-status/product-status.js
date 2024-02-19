import { Fragment } from 'preact'
import { useMemo } from 'preact/hooks'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function ProductStatus({ maxQuantity, isLoading, classStatus = '' }) {
  const lowStockThreshold = window.productState?.lowStockThreshold
  const lowStockMessage = window.productState?.lowStockMessage

  const getContent = (quantity) => {
    if (quantity > 0 && quantity <= lowStockThreshold) {
      return (
        <Fragment>
          <p className="font-semibold text-grey-900 mt-3.5">{translate.product.lowStock}</p>
          {lowStockMessage && maxQuantity > 0 && <p className="text-grey-900">{lowStockMessage}</p>}
        </Fragment>
      )
    } else if (quantity > lowStockThreshold) {
      return (
        <p className="font-semibold mt-3.5">{translate.product.inStock}</p>
      )
    } else {
      return (
        <p className="font-semibold text-grey-900 mt-3.5">{translate.product.outStock}</p>
      )
    }
  }

  const content = useMemo(() => getContent(maxQuantity), [maxQuantity])

  return !isLoading ? (
    <div className={`ml-4 text-sm md:ml-6 ${classStatus}`}>{content}</div>
  ) : (
    <div className="px-10 py-2.5">
      <div className="relative w-6 h-6">
        <LoaderSpin width={6} height={6} />
      </div>
    </div>
  )
}

export default ProductStatus
