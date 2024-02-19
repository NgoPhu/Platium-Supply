import Button from 'snippets/button/button'

export default function WishlistPageEmpty({ items }) {
  const translate = window.wishlistTranslate
  const customerState = window.GM_STATE.customer

  return (
    translate.wishlistEmptyTitle ? (
      <div className="py-6 mx-auto lg:py-16">
        <div className="text-center mx-auto lg:max-w-[674px]">
          <h3 class="h4 font-body lg:text-xl">
            {translate.wishlistEmptyTitle}
          </h3>
          {translate.wishlistEmptyDescription && <div className="pt-2 text-sm text-grey-600" dangerouslySetInnerHTML={{ __html: translate.wishlistEmptyDescription }}></div>}
          {translate.wishlistEmptyButton && translate.wishlistEmptyLink &&
            <a href={translate.wishlistEmptyLink} className={`block mt-6 w-full button-primary button-small lg:max-w-[215px] mx-auto h-12 flex-center normal-case ${customerState.logged && '!bg-[linear-gradient(180deg,_#03A6D7_0%,_#73D8D5_100%)] border-0'}`}>
              {translate.wishlistEmptyButton}
            </a>}
        </div>
      </div>
    ) : ''
  )
}
