import Image from 'snippets/image/image'

function PlpInlineBanner({ isMobile }) {
  const translate = window.inlineBanner
  return (
    translate.imageBanner ? (
      <div class="block w-full relative aspect-[376/140] overflow-hidden lg:rounded-tr-[40px] lg:rounded-bl-[40px] lg:aspect-[964/230] js-plp-inline-user">
        <div class="absolute fit">
        {translate.imageBanner ? (
          <Image
            imageUrl={[translate.imageBanner.src]}
            className="w-full aspect-[376/140] lg:rounded-tr-[40px] lg:rounded-bl-[40px] lg:aspect-[964/230]"
            imageClass="fit object-cover hover:zoom transition-all duration-300 ease-in-out"
            isCover={false}
            isLazy={true}
          />
        ) : ''}
        </div>
        {translate.titleBanner &&
          <div class="relative w-full h-full z-10 flex flex-col justify-center lg:px-14">
            <h2 class="hidden text-3xl font-body font-bold text-white lg:block">{translate.titleBanner}</h2>
            {translate.descriptionBanner && <div class="hidden mt-[6px] text-3xl text-accent-1 font-body lg:block" dangerouslySetInnerHTML={{ __html: translate.descriptionBanner }}></div>}
          </div>
        }
      </div>
    ) : '')
}

export default PlpInlineBanner
