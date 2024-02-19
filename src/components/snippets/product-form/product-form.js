import useProductForm from 'uses/useProductForm'
import ProductVariant from 'snippets/product-variant/product-variant'
import ProductATC from 'snippets/product-atc/product-atc'
import Price from 'snippets/price/price'
import { getBadges } from 'uses/useShopify'
import Badge from 'snippets/badge/badge'

function ProductForm() {
  const { productState, currentVariant, updateCurrentVariant, productData, currentVariantData } = useProductForm()
  const badges = getBadges(productState.initProduct.tags)

  return (
    <div className="js-product-form">
      <ProductVariant
        variants={productState.initProduct.variants}
        options={productState.initProduct.options}
        updateCurrentVariant={updateCurrentVariant}
        initVariant={window.productState.initVariant}
        updateUrl={true}
        displayType="button"
      />
      <div className="flex items-center gap-6 py-5 md:py-6">
        <Price
          className="flex flex-row-reverse justify-end gap-2 text-grey-900"
          classSize='text-2xl'
          classColor='font-bold text-primary'
          price={currentVariant.price}
          originalPrice={currentVariant.compare_at_price}
        />
        {badges && badges.length > 0 && (
          <Badge items={badges} className="flex flex-row gap-2" />
        )}
      </div>
      <ProductATC
        currentVariant={currentVariant}
        updateCurrentVariant={updateCurrentVariant}
        currentVariantData={currentVariantData}
        productData={productData}
        buttonText="Add to cart"
      />
    </div>
  )
}

export default ProductForm
