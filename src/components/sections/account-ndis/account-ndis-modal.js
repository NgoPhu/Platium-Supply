import CustomModalDialog from '@/components/modules/modal/custom-modal-dialog'
import AccountNdisType from './account-ndis-type'

function AccountNdisModal({ type }) {
  return (
    <CustomModalDialog
      id="account-ndis-modal"
      content={<AccountNdisType typeAccount={type} />}
      classClose="w-6 h-6 absolute top-4 right-6 md:top-6 md:right-7"
      classIcon="w-full h-full text-grey-600"
      classMain="relative w-full max-w-[580px] max-h-[90vh] flex flex-col bg-white border rounded-[10px] shadow-base mx-4"
      classContent="p-6 pt-4 md:p-8 md:pt-6 overflow-auto js-content-modal-dialog"
      scrollTarget="js-content-modal-dialog"
    />
  )
}

export default AccountNdisModal
