import { useEffect, useState, useMemo } from 'preact/hooks'
import { fetchData } from 'helpers/global'

function useProductForm() {
  const productState = window.productState
  const [currentVariant, setCurrentVariant] = useState(productState.initVariant)
  const [productData, setProductData] = useState(null)
  const [properties, setProperties] = useState({})

  const currentVariantData = useMemo(() => productData && productData?.variants_data[currentVariant.id], [currentVariant.id, productData])

  const updateCurrentVariant = (variant) => {
    if (currentVariant.id === variant.id) return
    setCurrentVariant(variant)
  }

  const getProductData = async () => {
    const endpoint = `/products/${productState.initProduct.handle}?view=ajax`
    const data = await fetchData(endpoint)
    if (data) {
      setProductData(data)
    }
  }

  useEffect(() => getProductData(), [])

  return {
    productState,
    currentVariant,
    updateCurrentVariant,
    productData,
    currentVariantData,
    setProductData,
    properties,
    setProperties
  }
}

export default useProductForm
