import { useState, useRef, useEffect } from 'preact/hooks'
import { initValidate } from 'helpers/validate'
import Icon from 'snippets/icon/icon'
import TextInput from '@/components/snippets/text-input/text-input'
import { formatDate, select } from 'helpers/dom'
import LoaderSpin from '@/components/snippets/loader-spin/loader-spin'

function AccountNdisType({ typeAccount }) {
  const [activeType, setActiveType] = useState(null)
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { formPlanManaged, formSelfManaged, formAgencyManaged } = GM_STATE.account

  const typeNdis = [
    {
      name: 'Self Managed',
      type: 'self-managed',
      id: formSelfManaged
    },
    {
      name: 'Plan Managed',
      type: 'plan-managed',
      id: formPlanManaged
    },
    {
      name: 'Agency Managed',
      type: 'agency-managed',
      id: formAgencyManaged
    }
  ]

  useEffect(() => {
    if (typeAccount) {
      setTimeout(() => {
        setActiveType(typeNdis.find(type => type.name === typeAccount))
        setIsOpenForm(true)
        setIsLoading(false)
      }, 2000)
    } else {
      setIsLoading(false)
    }
  }, [])

  return (!isLoading ? (
    !isOpenForm ? (
      <div>
        <h3 className="text-xl font-bold font-body text-grey-900 mb-4 md:mb-6">{typeAccount ? 'Change account type' : 'Select account type'}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {typeNdis.map(type => (
            <button
              className={`flex-center rounded-[10px] font-sans text-sm px-4 py-2 min-h-[48px] ${activeType?.name === type.name ? 'border-2 border-secondary font-bold text-secondary' : 'border border-grey-400 text-grey-900'}`}
              onClick={() => setActiveType(type)}
            >
              {type.name}
            </button>
          ))}
        </div>
        <button
          className="w-full button-primary mt-6" disabled={!activeType?.type}
          onClick={() => setIsOpenForm(true)}
        >
          Select
        </button>
      </div>
    ) : <AccountNdisInput key={activeType?.type} setIsOpenForm={setIsOpenForm} activeType={activeType} typeAccount={typeAccount} />
  ) : <LoaderSpin />)
}

export default AccountNdisType

function AccountNdisInput({ setIsOpenForm, activeType, typeAccount }) {
  if (!activeType) return

  const formRef = useRef(null)
  const [formValue, setFormValue] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const renderForm = (activeType) => {
    switch (activeType.name) {
      case 'Self Managed':
        return <FormSelfManaged formValue={formValue} />
      case 'Plan Managed':
        return <FormPlanManaged formValue={formValue} />
      case 'Agency Managed':
        return <FormAgencyManaged formValue={formValue} />
    }
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    const form = document.querySelector(`form[data-cf-form="${activeType.id}"]`)
    const buttonSubmit = select('button', form)
    const allInput = Array.from(formRef.current).filter(item => item.tagName.toLowerCase() !== 'button')

    allInput.forEach(input => {
      form?.cfForm.setFieldValue(input.id, input.value)
    })
    setFormValue(allInput.reduce((a, v) => ({ ...a, [v.id]: v.value }), {}))
    buttonSubmit?.click()
  }

  useEffect(() => {
    const form = document.querySelector(`form[data-cf-form="${activeType.id}"]`)
    if (form) {
      const allInputId = Array.from(formRef.current).filter(item => item.tagName.toLowerCase() !== 'button').map(item => item.id)
      allInputId && setFormValue(allInputId.reduce((a, v) => ({ ...a, [v]: form.cfForm.getFieldValue(v) }), {}))
    }

    const validate = initValidate(formRef.current, true)
    validate.onSuccess(onSubmitForm)
  }, [])

  return (
    <div>
      <div className="flex gap-2 mb-4 md:mb-6">
        <button onClick={() => setIsOpenForm(false)}>
          <Icon name="icon-chevron-back-outline-thin" className="w-6 h-6 text-grey-900" />
        </button>
        <h3 className="text-xl font-bold text-grey-900 font-body">{activeType.name}</h3>
      </div>
      {typeAccount && <button onClick={() => setIsOpenForm(false)} className="link mb-6 text-secondary underline">Change my account type</button>}
      <form id={`ndis-form-${activeType.type}`} ref={formRef} >
        <TextInput
          id="ndis_type"
          type="hidden"
          value={activeType.name}
          name="ndis_type"
        />
        {renderForm(activeType)}
        <button type="submit" className="button-primary w-full mt-6">
          {isLoading ? <LoaderSpin /> : 'Submit'}
        </button>
      </form>
    </div>
  )
}

function FormPlanManaged({ formValue }) {
  return (
    <>
      <TextInput
        id="organisation_name_of_payee"
        type="text"
        placeholder="Company"
        label="Company"
        required={true}
        name="organisation_name_of_payee"
        classWrap="mb-4"
        value={formValue.organisation_name_of_payee}
      />
      <TextInput
        id="billing_address_planmanage"
        type="text"
        placeholder="Billing Address of Plan Manager"
        label="Billing Address of Plan Manager"
        required={true}
        name="billing_address_planmanage"
        classWrap="mb-4"
        value={formValue.billing_address_planmanage}
      />
      <TextInput
        id="plan_manager_name"
        type="text"
        placeholder="Plan Manager Name"
        label="Plan Manager Name"
        required={true}
        name="plan_manager_name"
        classWrap="mb-4"
        value={formValue.plan_manager_name}
      />
      <TextInput
        id="ndis_full_name"
        type="text"
        placeholder="NDIS Full Name"
        label="NDIS Full Name"
        required={true}
        name="ndis_full_name"
        classWrap="mb-4"
        value={formValue.ndis_full_name}
      />
      <TextInput
        id="phone_number_ndis"
        type="phone"
        placeholder="NDIS Phone Number"
        label="NDIS Phone Number"
        required={true}
        name="phone_number_ndis"
        classWrap="mb-4"
        value={formValue.phone_number_ndis}
      />
      <TextInput
        id="email_ndis"
        type="email"
        placeholder="NDIS Email"
        label="NDIS Email"
        required={true}
        name="email_ndis"
        classWrap="mb-4"
        value={formValue.email_ndis}
      />
      <TextInput
        id="ndis_number"
        type="text"
        placeholder="NDIS Number #"
        label="NDIS Number #"
        required={true}
        name="ndis_number"
        classWrap="mb-4"
        value={formValue.ndis_number}
      />
      <TextInput
        id="ndis_part_shipping_address"
        type="text"
        placeholder="NDIS Participant Shipping Address"
        label="NDIS Participant Shipping Address"
        required={true}
        name="ndis_part_shipping_address"
        classWrap="mb-4"
        value={formValue.ndis_part_shipping_address}
      />
      <TextInput
        id="ndis_dob"
        type="date"
        placeholder="NDIS DOB"
        label="NDIS DOB"
        required={true}
        name="ndis_dob"
        value={formatDate(formValue.ndis_dob)}
      />
    </>
  )
}

function FormSelfManaged({ formValue }) {
  return (
    <>
      <TextInput
        id="ndis_full_name"
        type="text"
        placeholder="NDIS Full Name"
        label="NDIS Full Name"
        required={true}
        name="ndis_full_name"
        classWrap="mb-4"
        value={formValue.ndis_full_name}
      />
      <TextInput
        id="phone_number_ndis"
        type="phone"
        placeholder="NDIS Phone Number"
        label="NDIS Phone Number"
        required={true}
        name="phone_number_ndis"
        classWrap="mb-4"
        value={formValue.phone_number_ndis}
      />
      <TextInput
        id="email_ndis"
        type="email"
        placeholder="NDIS Email"
        label="NDIS Email"
        required={true}
        name="email_ndis"
        classWrap="mb-4"
        value={formValue.email_ndis}
      />
      <TextInput
        id="ndis_number"
        type="text"
        placeholder="NDIS Number #"
        label="NDIS Number #"
        required={true}
        name="ndis_number"
        classWrap="mb-4"
        value={formValue.ndis_number}
      />
      <TextInput
        id="ndis_billing_address"
        type="text"
        placeholder="NDIS Billing Address"
        label="NDIS Billing Address"
        required={true}
        name="ndis_billing_address"
        classWrap="mb-4"
        value={formValue.ndis_billing_address}
      />
      <TextInput
        id="ndis_shipping_address"
        type="text"
        placeholder="NDIS Shipping Address"
        label="NDIS Shipping Address"
        required={true}
        name="ndis_shipping_address"
        classWrap="mb-4"
        value={formValue.ndis_shipping_address}
      />
      <TextInput
        id="ndis_dob"
        type="date"
        placeholder="NDIS DOB"
        label="NDIS DOB"
        required={true}
        name="ndis_dob"
        value={formatDate(formValue.ndis_dob)}
      />
    </>
  )
}

function FormAgencyManaged({ formValue }) {
  return (
    <>
      <TextInput
        id="ndis_full_name"
        type="text"
        placeholder="NDIS Full Name"
        label="NDIS Full Name"
        required={true}
        name="ndis_full_name"
        classWrap="mb-4"
        value={formValue.ndis_full_name}
      />
      <TextInput
        id="ndis_number"
        type="text"
        placeholder="NDIS Number #"
        label="NDIS Number #"
        required={true}
        name="ndis_number"
        classWrap="mb-4"
        value={formValue.ndis_number}
      />
      <TextInput
        id="ndis_dob"
        type="date"
        placeholder="NDIS DOB"
        label="NDIS DOB"
        required={true}
        name="ndis_dob"
        classWrap="mb-4"
        value={formatDate(formValue.ndis_dob)}
      />
      <TextInput
        id="ndis_shipping_address"
        type="text"
        placeholder="NDIS Shipping Address"
        label="NDIS Shipping Address"
        required={true}
        name="ndis_shipping_address"
        classWrap="mb-4"
        value={formValue.ndis_shipping_address}
      />
      <TextInput
        id="ndis_billing_address"
        type="text"
        placeholder="NDIS Billing Address"
        label="NDIS Billing Address"
        required={true}
        name="ndis_billing_address"
        classWrap="mb-4"
        value={formValue.ndis_billing_address}
      />
      <TextInput
        id="service_booking_type"
        type="text"
        placeholder="Service Booking Type"
        label="Service Booking Type"
        required={true}
        name="service_booking_type"
        classWrap="mb-4"
        value={formValue.service_booking_type}
      />
      <TextInput
        id="service_booking_startend"
        type="text"
        placeholder="Service Booking start-end"
        label="Service Booking start-end"
        required={true}
        name="service_booking_startend"
        classWrap="mb-4"
        value={formValue.service_booking_startend}
      />
      <TextInput
        id="support_budget"
        type="text"
        placeholder="Support Budget"
        label="Support Budget"
        required={true}
        name="support_budget"
        classWrap="mb-4"
        value={formValue.support_budget}
      />
      <TextInput
        id="allocated_amount"
        type="text"
        placeholder="Allocated Amount"
        label="Allocated Amount"
        required={true}
        name="allocated_amount"
        classWrap="mb-4"
        value={formValue.allocated_amount}
      />
      <TextInput
        id="clain_type"
        type="text"
        placeholder="Claim Type"
        label="Claim Type"
        required={true}
        name="clain_type"
        classWrap="mb-4"
        value={formValue.clain_type}
      />
      <TextInput
        id="support_item_name"
        type="text"
        placeholder="Support Item Name"
        label="Support Item Name"
        required={true}
        name="support_item_name"
        classWrap="mb-4"
        value={formValue.support_item_name}
      />
      <TextInput
        id="support_item_number"
        type="text"
        placeholder="Support Item Number"
        label="Support Item Number"
        required={true}
        name="support_item_number"
        value={formValue.support_item_number}
      />
    </>
  )
}
