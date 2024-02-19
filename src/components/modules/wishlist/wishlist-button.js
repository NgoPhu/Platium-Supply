import { Fragment } from 'preact'
import SwymWishlistServices from '@/components/uses/useSwymWishlist'
import register from 'preact-custom-element'
import { useEffect, useState } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import { eventProps } from 'helpers/global'
import LoaderSpin from 'snippets/loader-spin/loader-spin'
import CustomModalDialog from '@/components/modules/modal/custom-modal-dialog'
import TextInput from 'snippets/text-input/text-input'
import CheckboxInput from 'snippets/checkbox-input/checkbox-input'
import { selectAll, select, on, addClass, removeClass } from 'helpers/dom'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

const selectors = {
  inputEl: '.js-input',
  modalAddList: 'modal-dialog[id="wishlist-add-list-modal"]',
  sectionPdpMain: '.js-section-product-main',
  activeModal: 'z-50'
}

function WishlistButton () {
  const wishlistInstance = new SwymWishlistServices()

  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const modal = document.querySelector(selectors.modalAddList)
  const sectionPdpMain = document.querySelector(selectors.sectionPdpMain)
  modal && on('open-modal', () => {
    addClass(selectors.activeModal, sectionPdpMain)
  }, modal)

  modal && on('close-modal', () => {
    removeClass(selectors.activeModal, sectionPdpMain)
  }, modal)

  const addToWishList = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const payload = window.SwymPageData
      const list = await wishlistInstance.getAllList()

      const res = await wishlistInstance.addToWishlist(list[0].lid, payload)

      if (res) {
        globalEvents.emit(eventProps.notice.global, {
          type: 'success',
          content: 'Item added to wishlist',
          classCustom: 'notice-main-wishlist'
        })
        globalEvents.emit(eventProps.wishlist.change, res)
        setIsLoading(false)
        setIsAdded(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const removeFromWishlist = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const payload = window.SwymPageData

      const res = await wishlistInstance.removeFromWishlist(wishlistInstance.list[0].lid, payload)

      if (res) {
        globalEvents.emit(eventProps.notice.global, {
          type: 'success',
          content: 'Item removed in wishlist'
        })
        globalEvents.emit(eventProps.wishlist.change, res)
        setIsLoading(false)
        setIsAdded(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = (e) => {
    if (isAdded) removeFromWishlist(e)
    else addToWishList(e)

    globalEvents.emit(eventProps.wishlist.change, true)
  }

  useEffect(() => {
    globalEvents.on(eventProps.wishlist.list, (value) => {
      const added = value.some(item => item.listcontents.some(el => el.empi === window.SwymPageData.empi))
      setIsAdded(added)
    })
  }, [])

  return (
    <ModalAddList />
  )
}

register(WishlistButton, 'wishlist-button')

function ModalAddList() {
  return (
    <CustomModalDialog
      id="wishlist-add-list-modal"
      header="Shipping Information"
      content={<ContentAddList />}
      classClose="w-8 h-8 absolute top-4 right-4"
      classIcon="w-full h-full text-grey-500"
      classMain="relative w-full max-w-[524px] max-h-[80vh] overflow-y-auto flex flex-col bg-white md-max:mx-4 rounded-lg shadow-base border border-default pointer-events-none [.modal-dialog-opened_&]:pointer-events-auto"
      classModal="md-max:items-end"
      classHeader="p-4 md:px-6 md:py-5 text-grey-900 font-semibold flex items-center justify-between border-b"
      classContent="js-content-modal-dialog"
    />
  )
}

function ContentAddList() {
  const wishlistInstance = new SwymWishlistServices()
  const productState = window.productState
  const [listWishlist, setListWishlist] = useState([])
  const [checkboxes, setCheckboxes] = useState([])
  const [checkboxesInit, setCheckboxesInit] = useState([])
  const [isNewList, setIsNewList] = useState(false)
  const [acceptUpdate, setAcceptUpdate] = useState(true)
  const [currentVariant, setCurrentVariant] = useState(productState.initVariant)
  const modal = document.querySelector(selectors.modalAddList)

  useEffect(() => {
    globalEvents.on(eventProps.product.updateVariant, (value) => {
      setCurrentVariant(value)
    })
  })

  modal && on('close-modal', () => {
    setIsNewList(false)
  }, modal)

  useEffect(() => {
    const listCheckbox = selectAll('.js-checkbox-list')
    const propCheckbox = listCheckbox?.map((item, index) => {
      return {
        id: item.id,
        idx: index,
        isChecked: item.checked,
        value: item.value
      }
    })
    setCheckboxes(propCheckbox)
    setCheckboxesInit(propCheckbox)
  }, [listWishlist, currentVariant])

  useEffect(() => {
    globalEvents.on(eventProps.wishlist.list, (value) => {
      setListWishlist(value)
    })
  }, [])

  const openNewList = () => {
    setIsNewList(true)
  }

  const onSelected = (item, index) => {
    const updateCheckboxes = checkboxes.map((checkbox) => {
      if (checkbox.idx === index) {
        return { ...checkbox, isChecked: !checkbox.isChecked }
      }
      return checkbox
    })
    setCheckboxes(updateCheckboxes)
  }

  useEffect(() => {
    const initStateChecked = checkboxesInit.map((checkbox) => { return checkbox.isChecked })
    const stateChecked = checkboxes.map((checkbox) => { return checkbox.isChecked })
    if (JSON.stringify(initStateChecked) === JSON.stringify(stateChecked)) {
      setAcceptUpdate(true)
    } else {
      setAcceptUpdate(false)
    }
  }, [checkboxes, checkboxesInit])

  const updateList = async (e) => {
    e.preventDefault()
    const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.isChecked)
    const notCheckedCheckboxes = checkboxes.filter(checkbox => !checkbox.isChecked)
    const listAdd = checkedCheckboxes.map(checkbox => {
      return checkbox.value
    })
    const listRemove = notCheckedCheckboxes.map(checkbox => {
      return checkbox.value
    })

    try {
      const payload = {
        ...window.SwymPageData,
        epi: currentVariant.id,
        cprops: {
          available: currentVariant.available
        }
      }

      const resAdd = await wishlistInstance.addToMultiWishlist(listAdd, payload)
      const resRemove = await wishlistInstance.removeFromMultiWishlist(listRemove, payload)
      const modal = document.querySelector(selectors.modalAddList)
      if (resAdd && resRemove) {
        globalEvents.emit(eventProps.notice.global, {
          type: 'success',
          content: 'Item saved to Wishlist',
          classCustom: 'notice-main-wishlist'
        })
        globalEvents.emit(eventProps.wishlist.update, true)
        modal && modal.hide()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div key={currentVariant}>
      <h3 className="px-6 py-5 lg-max:!pr-20 lg:!pr-16 lg:px-8 lg:py-7 border-b border-default text-lg font-bold font-body text-grey-900 lg:text-xl">{productState.initProduct.title}</h3>
      <div className={`p-6 lg:p-8 ${isNewList ? 'h-[184px]' : 'h-auto'}`}>
        {
          listWishlist?.length > 0 ? (
          <div className="relative">
            <div className={`${isNewList ? 'opacity-0' : 'opacity-100'}`}>
              {
                listWishlist?.map((item, index) => (
                  <div key={index} className="pb-6 mb-6 border-b border-default last:mb-0 last:border-b-0">
                    <CheckboxInput
                      index={index}
                      checked={item?.listcontents.some((el) => el.epi === currentVariant.id)}
                      onSelected={() => onSelected(item, index)}
                      classWrap="!mt-0 flex-row-reverse [&>label]:ml-0 [&>label]:justify-start [&>label]:gap-1"
                      classInput="js-checkbox-list"
                      label={item?.lname}
                      value={item?.lid}
                      count={item?.cnt}
                    />
                  </div>
                ))
              }
            </div>
            <div className={`flex flex-col gap-4 md:flex-row ${isNewList ? 'opacity-0' : 'opacity-100'}`}>
              <button className="w-full button-outlined md:w-1/2" onClick={openNewList}>Create new list</button>
              <button className="w-full button-primary md:w-1/2" onClick={updateList} disabled={acceptUpdate} >Update list</button>
            </div>
            <ModalNewList isNewList={isNewList} classWrap="absolute top-0 w-full h-full" setIsNewList={setIsNewList} listWishlist={listWishlist} />
          </div>
          ) : (
          <ModalNewList/>
          )
        }
      </div>
    </div>
  )
}

function ModalNewList({ isNewList = true, classWrap = '', setIsNewList, listWishlist }) {
  const wishlistInstance = new SwymWishlistServices()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [inputError, setInputError] = useState()
  const [checked, setChecked] = useState(true)

  const onInput = (e) => {
    if (listWishlist?.some((list) => list.lname === e.target.value)) {
      setName(e.target.value)
      setInputError('exists')
    } else {
      setName(e.target.value)
      setInputError('')
    }
  }

  const addList = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const payload = window.SwymPageData

      if (name) {
        const resList = await wishlistInstance.createList(name)
        const res = await wishlistInstance.addToWishlist(resList.lid, payload)
        if (res) {
          globalEvents.emit(eventProps.wishlist.change, res)
          setIsLoading(false)
          setIsNewList(false)
          setName('')
        }
      } else {
        setInputError('provide')
        setIsLoading(false)
        setName('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSelected = () => {
    setChecked(!checked)
  }

  const classInput = inputError ? 'peer input no-autocomplete text-grey-900 placeholder:text-grey-500 focus:shadow-0 focus:outline-none !px-5 !py-3 is-invalid [&.is-invalid]:!text-error-content' : 'peer input no-autocomplete text-grey-900 placeholder:text-grey-500 focus:shadow-0 focus:outline-none !px-5 !py-3'

  return (
    <div className={`${classWrap} ${isNewList ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center gap-6">
        <TextInput
          classWrap="[&>.input-label]:!hidden flex-1"
          type="text"
          className={classInput}
          placeholder="My Wishlist"
          value={name}
          onInput={onInput}
        />
        <CheckboxInput checked={checked} onSelected={onSelected} classWrap="!mt-0" />
      </div>
      {inputError && <p className="-mb-3 input-error">{inputError === 'exists' ? 'List name already exists' : 'Must provide a list name'}</p>}
      <button className="w-full mt-6 button-outlined" onClick={addList} disabled={!checked || inputError}>
        {isLoading ? (
          <LoaderSpin />
        ) : (
          <Fragment>
            Create new list
          </Fragment>
        )}
      </button>
    </div>
  )
}
