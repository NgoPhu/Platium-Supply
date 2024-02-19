import { useMemo } from 'preact/hooks'

function Image({
  imageUrl,
  alt,
  className,
  imageClass,
  isLazy = true,
  isCover = true,
  imageSizes = '[132,155,180,300,360,375,540,720,900,1080,1296,1512,1728,1944,2160,2376,2592,2808,3024]'
}) {
  const currentImageUrls = useMemo(() => (imageUrl && imageUrl.length > 0 && imageUrl.some(Boolean)) ? imageUrl : [window.GM_STATE.shopify.defaultImage], [imageUrl])
  const classImage = `${isCover ? 'object-cover' : 'object-contain'} ${isLazy && 'lazyload lazy'} ${imageClass}`
  const customClass = `relative ${className}`

  const imagesSrc = useMemo(() => {
    if (currentImageUrls[0].includes('cdn.shopify.com')) {
      if (/_\d+x\d\./g.test(currentImageUrls[0])) {
        return currentImageUrls[0].replace(/_\d+x\d\./g, '_{width}x.')
      }

      if (/\.(jpg|png|webp|jpeg|gif|bmp)(\?.*)?$/.test(currentImageUrls[0])) {
        return currentImageUrls[0].replace(/(\.(jpg|png|webp|jpeg|gif|bmp))(\?v=\d+)$/, '_{width}x$1$3')
      }
    }

    return currentImageUrls[0]
  }, [currentImageUrls])

  return (
    <figure className={customClass}>
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUCB1j+Pjx438ACX0D04PrXz0AAAAASUVORK5CYII="
        className={classImage}
        data-src={imagesSrc}
        data-sizes="auto"
        data-widths={imageSizes}
        alt={alt}
      />
    </figure>
  )
}

export default Image
