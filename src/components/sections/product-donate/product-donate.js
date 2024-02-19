import register from 'preact-custom-element'
import { useEffect, useMemo, useState } from 'preact/hooks'
import { fetchData } from 'helpers/global'
import Image from 'snippets/image/image'
import Price from 'snippets/price/price'
import ProductATC from 'snippets/product-atc/product-atc'

function ProductDonate() {
  const [productData, setProductData] = useState(null)
  const productState = window.productState

  const getProductData = async () => {
    const endpoint = `/products/${productState.initProduct}?view=ajax`
    const data = await fetchData(endpoint)
    if (data) {
      setProductData(data)
    }
  }

  useEffect(() => getProductData(), [])

  const currentVariant = productData?.initVariant
  const currentVariantData = useMemo(() => productData && productData?.variants_data[currentVariant?.id], [currentVariant?.id, productData])

  return (
    productData && (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        <div className="max-w-[330px] w-full aspect-1 mx-auto lg:max-w-[468px]">
          <Image
            imageUrl={[productData?.images[0]]}
            imageClass="w-full h-full"
            imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
            isCover={false}
            isLazy={true}
          />
        </div>
        <div className="border border-default rounded-[10px] bg-white p-4 shadow-base lg:p-12 h-fit">
          <h3 className="text-xl font-bold font-body text-grey-900 lg:text-2xl">{productData?.title}</h3>
          {productData?.initVariant?.sku && <span className="block mt-3 font-sans text-xs text-grey-900">SKU: {productData?.initVariant?.sku}</span>}
          <Price
            className="flex flex-row-reverse items-baseline justify-end gap-2 py-4 md:py-6"
            classSize="text-sm font-body font-normal text-grey-900"
            price={productData.price}
            originalPrice={productData.compareAtPriceMin}
            classColor="text-primary !font-bold font-body !text-2xl"
          />
          {productData?.description && <div className="block font-sans text-sm text-grey-600 [&>*]:inline h-[72px] truncate !whitespace-normal line-clamp-3" dangerouslySetInnerHTML={{ __html: productData?.description }}></div>}
          <ProductATC
            currentVariant={currentVariant}
            currentVariantData={currentVariantData}
            buttonText="Add to Cart"
            classWrapper="flex flex-col mt-4 md:flex-row gap-4 lg:mt-6"
            classStatus="hidden"
            classWrapQuantity="w-full md:w-[146px]"
            buttonClass="w-full md:w-[187px]"
            classInner="md-max:w-full"
            classWrapperQuantity="!flex"
            classButtonWishlist="!hidden"
          />
          <a href={`/products/${productState.initProduct}`} className="block mt-4 underline normal-case link text-secondary hover:text-grey-900 lg:mt-6">{productState.view_product}</a>
        </div>
      </div>
    )
  )
}

register(ProductDonate, 'product-donate')
