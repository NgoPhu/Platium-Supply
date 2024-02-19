import { formToObject } from 'helpers/dom'
import { eventProps } from 'helpers/global'
import { initValidate } from 'helpers/validate'
import CustomModalDialog from '@/components/modules/modal/custom-modal-dialog'
import { useContext, useState, useEffect, useRef } from 'preact/hooks'
import TextInput from 'snippets/text-input/text-input'
import Textarea from 'snippets/text-input/textarea'
import Icon from 'snippets/icon/icon'
import WishlistContext from './context'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

export default function WishlistShare({ item }) {
  return (
    <CustomModalDialog
      id="wishlist-share-modal"
      header="Shipping Information"
      content={<ContentShare item={item} />}
      classClose="w-6 h-6 absolute top-4 right-4"
      classIcon="w-full h-full text-grey-600"
      classMain="relative w-full max-w-[344px] max-h-[90vh] flex flex-col bg-white border rounded-[10px] shadow-base md:max-w-[460px]"
      classModal="md-max:items-end"
      classHeader="p-4 md:px-6 md:py-5 text-grey-900 font-semibold flex items-center justify-between border-b"
      classContent="p-8 lg:p-[60px] overflow-auto js-content-modal-dialog"
      scrollTarget="js-content-modal-dialog"
    />
  )
}

function ContentShare ({ item }) {
  const { swym } = useContext(WishlistContext)
  const classWrap = 'flex flex-col items-start mt-4'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)
  const copyRef = useRef(null)
  const [isCopy, setIsCopy] = useState(false)

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const formData = formToObject(e.target)

      const res = await swym.sendListViaEmail(item?.lid, formData)
      const modal = document.querySelector('modal-dialog[id="wishlist-share-modal"]')

      if (res) {
        setIsSubmitting(false)
        globalEvents.emit(eventProps.notice.global, {
          type: 'success',
          content: 'This wishlist was shared via email!',
          classCustom: 'notice-main-wishlist'
        })
        modal && modal.hide()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const validate = initValidate(formRef.current, true)
    validate.onSuccess(onSubmitForm)
  }, [])

  const handleGetLink = async () => {
    const getLink = await swym.generateSharedListURL(item.lid)
    navigator.clipboard.writeText(getLink).then(() => {
      setIsCopy(true)
    })
  }

  const handleShare = async (platform) => {
    await swym.shareListSocial(item.lid, {
      name: '',
      platform,
      note: ''
    })
  }

  return (
    <>
      <div className='text-xl font-bold text-center text-grey-900 font-body lg:text-2xl'>
        Share via email
      </div>
      <form id="wishlist-share-form" ref={formRef}>
        <TextInput
          classWrap={classWrap}
          id='wishlist-sender-name'
          name="name"
          placeholder='Sender name'
          required={true}
        />
        <TextInput
          classWrap={classWrap}
          id='wishlist-recipients-email'
          name="email"
          type="email"
          placeholder='Recipients email'
          required={true}
        />
        <Textarea
          classWrap={classWrap}
          id='wishlist-message'
          name="note"
          placeholder='Message'
          label='Message'
          className='h-[124px]'
        />
        <button type="submit" className='relative w-full mt-4 normal-case button-primary'>
          {isSubmitting ? <LoaderSpin wrapperClass='bg-transparent' /> : 'Share wishlist'}
        </button>
      </form>
      <div className='relative my-6 before:absolute before:top-1/2 before:left-0 before:z-10 before:-translate-y-1/2 before:w-full before:h-px before:bg-default'>
        <span className='relative z-20 block px-4 mx-auto text-base bg-white text-grey-700 w-fit'>Or share via</span>
      </div>
      <div className='flex items-center justify-center gap-6'>
        <div className='flex items-center gap-2 cursor-pointer' onClick={handleGetLink}>
          <Icon name='icon-link-outline' viewBox='0 0 24 24' className='w-6 h-6 text-grey-500' />
          <span className='text-xs text-grey-700' ref={copyRef}>{isCopy ? 'Copied' : 'Copy link'}</span>
        </div>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleShare('facebook')}>
          <Icon name='icon-facebook-outline' viewBox='0 0 16 16' className='w-4 h-4 text-grey-500' />
          <span className='text-xs text-grey-700'>Facebook</span>
        </div>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleShare('twitter')}>
          <Icon name='icon-twitter-outline' viewBox='0 0 20 16' className='w-5 h-4 text-grey-500' />
          <span className='text-xs text-grey-700'>Twitter</span>
        </div>
      </div>
    </>
  )
}
