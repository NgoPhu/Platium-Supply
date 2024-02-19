import { useEffect, useMemo, useState } from 'preact/hooks'
import { getBadges, addBadgeSale } from 'uses/useShopify'
import Badge from 'snippets/badge/badge'
import Image from 'snippets/image/image'
import PlpCardPrice from 'snippets/plp-card-price/plp-card-price'
import PlpQuickAdd from 'snippets/plp-quick-add/plp-quick-add'
import useInCart from 'uses/useInCart'

function PlpCard({
  className = '',
  title,
  handle,
  imageUrl,
  secondImageUrl,
  alt = title,
  variants,
  tags = [],
  isMiniCart = false,
  showQuickAdd = false,
  ratioImage = 'aspect-1',
  description
}) {
  const [currentVariant, setCurrentVariant] = useState(variants[0])
  const [reRenderKey, setRenderKey] = useState(variants[0].id)
  const [reRenderATC, setReRenderATC] = useState(variants[0].id)

  const { isAvailable, maxVariantQuantity } = useInCart(currentVariant)

  let badges = getBadges(tags)

  if (currentVariant.price < currentVariant.compare_at_price) {
    badges = addBadgeSale(badges, currentVariant.price, currentVariant.compare_at_price)
  }

  const productUrl = `/products/${handle}?variant=${currentVariant.id}`
  const currentImageUrl = useMemo(() => currentVariant?.image || currentVariant?.featured_image?.src || imageUrl, [currentVariant])
  const getSecondImage = useMemo(() => typeof secondImageUrl === 'string' ? secondImageUrl : secondImageUrl[1], [secondImageUrl])

  useEffect(() => {
    setRenderKey(reRenderKey + 1)
  }, [currentImageUrl])

  useEffect(() => {
    setReRenderATC(reRenderATC + 1)
  }, [maxVariantQuantity])

  return (
    <div className={`relative flex flex-col lg:overflow-hidden plp-card ${className}`}>
      <div className={`plp-card-image w-full relative overflow-hidden ${ratioImage}`}>
        <a href={productUrl} title={title} className="block w-full h-full">
          <Image
            imageUrl={[currentImageUrl]}
            alt={alt}
            className="!fit plp-card-image-first"
            imageClass="w-full h-full fit object-cover"
            imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
            isCover={true}
            isLazy={true}
          />
          {secondImageUrl && secondImageUrl.length > 1 &&
            <Image
              imageUrl={[getSecondImage]}
              alt={alt}
              className="!fit plp-card-image-second opacity-0 transition-opacity"
              imageClass="w-full h-full fit object-cover"
              imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
              isCover={true}
              isLazy={true}
            ></Image>
          }
        </a>
      </div>
      <div className="flex-1 flex flex-col mt-4 plp-card-content md:mt-6">
        <div className="flex plp-card-content-badge gap-2 mb-3 md:mb-4">
          <div className="bg-grey-300 w-fit flex items-center gap-2 h-7 py-1 px-4 rounded-[99px] plp-card-label">
            <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-success-bright' : 'bg-warning-content'}`}></div>
            <div className="text-med font-medium">{isAvailable ? 'In Stock' : '1-5 Days'}</div>
          </div>
          {badges && badges.length > 0 && (
            <div className="absolute z-10 left-0 top-0 pointer-events-none plp-card-badge">
              <Badge items={badges} className="flex flex-col gap-2" />
            </div>
          )}
        </div>
        <div className="flex-1 plp-card-title">
          <a className="flex flex-col" href={productUrl} title={title}>
            <div className="plp-card-button">
              <PlpCardPrice price={currentVariant.price} originalPrice={currentVariant.compare_at_price} />
            </div>
            <div className="text-sm text-grey-900 line-clamp-2 mt-1 lg:mt-2 plp-card-text">
              {title}
            </div>
          </a>
        </div>
        {description && <div className="hidden text-grey-600 mt-4 plp-card-description" dangerouslySetInnerHTML={{ __html: description }}></div>}
      </div>
    </div>
  )
}

export default PlpCard
