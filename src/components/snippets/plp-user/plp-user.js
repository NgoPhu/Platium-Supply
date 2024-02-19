import { Fragment } from 'preact'
import Icon from 'snippets/icon/icon'
import Image from 'snippets/image/image'

function PlpUser({ className, classDescription, saleIcon, isMobile }) {
  const translate = window.userConfig
  const isLogged = translate.isLogged

  return (
    translate.saleInfo || translate.saleImage ? (
      <div className={`bg-white rounded-[10px] border lg:border-x-none border-default shadow-base flex flex-col lg:flex-row lg:justify-between ${className} ${(isMobile && isLogged) ? 'hidden' : ''}` }>
        <div className={`relative flex justify-center items-center gap-x-[14px] w-full lg:gap-x-5 lg:py-8 lg:px-6 xl:pr-14 p-5 sale-contact-info ${isLogged ? 'lg:max-w-[360px] xl:max-w-full' : ''}`}>
            <span className={`absolute top-5 right-5 hidden ${saleIcon}`}>
              <Icon name="icon-pulse" className="w-3.5 h-3.5" />
            </span>
              {translate.saleImage ? (
                <Image
                  imageUrl={[translate.saleImage]}
                  className="w-[60px] lg:w-20 aspect-1 sale-contact-info-image"
                  imageClass="fit object-cover hover:zoom transition-all duration-300 ease-in-out"
                  imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
                  isCover={false}
                  isLazy={true}
                />
              ) : ''}
            <div class="flex-1 w-full sale-contact-info-content">
              <h4 class="w-full lg:max-w-[200px] text-base text-grey-900 font-body font-bold">{translate.saleInfo}</h4>
              {translate.saleDescription && <div className={`pt-[2px] text-sm text-grey-900 [&>p>a]:underline lg:pt-1 [&>p>a]:hover:text-secondary ${classDescription}`} dangerouslySetInnerHTML={{ __html: translate.saleDescription }}></div>}
            </div>
        </div>
        {translate.salePhoneNumber &&
          <div class="flex flex-row lg:flex-col items-center w-full lg:max-w-[201px] border-t lg:border-l lg:border-t-0 border-default sale-contact-button">
            <div class="flex justify-center items-center w-full px-[18px] py-[14px] h-full md-max:min-h-[56px] lg:h-1/2 border-r lg:border-b lg:border-r-0 border-default">
              <Icon name="icon-phone" className="w-5 h-5 text-secondary" />
              <div className="pl-2 font-sans text-sm font-medium text-grey-900 hover:text-secondary" dangerouslySetInnerHTML={{ __html: translate.salePhoneNumber }}></div>
            </div>
            {translate.saleLiveChat &&
              <div class="flex justify-center items-center w-full px-[18px] py-[14px] h-full md-max:min-h-[56px] lg:h-1/2">
                <Icon name="icon-chatbox" className="w-5 h-5 text-secondary" />
                <div className="pl-2 font-sans text-sm font-medium text-grey-900 hover:text-secondary" dangerouslySetInnerHTML={{ __html: translate.saleLiveChat }}></div>
              </div>
            }
          </div>
        }
      </div>
    ) : ''
  )
}

export default PlpUser
