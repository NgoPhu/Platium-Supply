import { Fragment } from 'preact'

function ProductNote({ content, className }) {
  const translate = window.productState
  const isLogged = translate.isLogged

  return (
    translate.productNoteShipping && (
      <div className="flex flex-col items-start gap-2 pt-5 xl:flex-row xl:items-center xl:gap-0 xl:pt-6">
        {translate.productNoteShipping && <div className={`relative text-med font-semibold text-grey-900 [&>p>a]:text-secondary after:content-none after:h-[15px] after:w-[1px] after:bg-grey-500 after:absolute after:top-1 after:right-0 xl:pr-4 ${!isLogged ? 'xl:after:content-[""]' : ''}`} dangerouslySetInnerHTML={{ __html: translate.productNoteShipping }}></div>}
        {!isLogged && translate.productNoteOrder && <div className="text-med font-semibold text-grey-900 [&>p>a]:text-secondary xl:pl-4" dangerouslySetInnerHTML={{ __html: translate.productNoteOrder }}></div> }
      </div>
    )
  )
}

export default ProductNote
