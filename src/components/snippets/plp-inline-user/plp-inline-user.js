import AccordionItem from 'snippets/accordion-item/accordion-item'
import PlpUser from '../plp-user/plp-user'
import { Fragment } from 'preact'

function PlpInlineUser({ content, className, isMobile }) {
  const translate = window.userConfig
  const isLogged = translate.isLogged

  return (
    <Fragment>
      {!isMobile &&
        <PlpUser className="collection-sale-contact" classDescription={`${isLogged ? 'link text-med normal-case' : 'text-sm text-link text-center'}`} saleIcon={`${isLogged ? '!block' : ''}`} />
      }
      {isMobile &&
        <AccordionItem
          titleClass="w-full h-full min-h-[56px] px-4 py-3.5 text-sm text-grey-900 font-bold capitalize"
          wrapperClass={`bg-white ${isLogged ? 'block' : 'hidden'}`}
          heading={translate.saleTitleMobile}
          classIcon="text-secondary"
          isOverflow={false}
          content={
            <PlpUser className="collection-sale-contact" classDescription={`${isLogged ? 'link text-med normal-case' : ''}`} saleIcon={`${isLogged ? '!block' : ''}`} />
          }
        />
      }
    </Fragment>
  )
}

export default PlpInlineUser
