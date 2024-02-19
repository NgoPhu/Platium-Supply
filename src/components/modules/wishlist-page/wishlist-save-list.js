import CustomModalDialog from '@/components/modules/modal/custom-modal-dialog'

export default function WishlistSaveList() {
  return (
    <CustomModalDialog
      id="wishlist-save-list-modal"
      header="Shipping Information"
      content={<ContentSaveList />}
      classClose="w-6 h-6 absolute top-4 right-4"
      classIcon="w-full h-full text-grey-600"
      classMain="relative w-full max-w-[344px] max-h-[90vh] flex flex-col bg-white border rounded-[10px] shadow-base md:max-w-[460px] p-8 lg:p-[60px]"
      classModal="md-max:items-end"
      classHeader="p-4 md:px-6 md:py-5 text-grey-900 font-semibold flex items-center justify-between border-b"
    />
  )
}

function ContentSaveList () {
  const translate = window.wishlistTranslate

  return (
    translate?.saveWishlistTitle ? (
      <div className="flex flex-col items-center justify-center">
        <h3 className="mb-2 text-xl font-bold font-body text-grey-900 lg:text-2xl">{translate?.saveWishlistTitle}</h3>
        {translate?.saveWishlistDescription && <p className="mb-6 text-sm text-center text-grey-600">{translate?.saveWishlistDescription}</p>}
        {translate?.saveWishlistButton && <a href='/account/login?redirect=wishlist' className='block w-full button-primary'>{translate?.saveWishlistButton}</a>}
      </div>
    ) : ''
  )
}
