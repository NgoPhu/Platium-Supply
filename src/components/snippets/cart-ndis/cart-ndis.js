import { useEffect, useState } from 'preact/hooks'
import Image from 'snippets/image/image'

const ENABLED_NDIS = 'enbale_ndis'

function CartNdis() {
  const [isChecked, setIsChecked] = useState(true)
  const { ndisLogo, ndisFormTitle, ndisFormDescription } = GM_STATE.cart
  const { ndisEnable } = GM_STATE.customer

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  useEffect(() => {
    ndisEnable && sessionStorage.setItem(ENABLED_NDIS, isChecked)
  }, [isChecked])

  return (ndisEnable &&
    <div className="rounded-lg border border-custom-2 shadow-base p-6 mb-4 lg-max:mt-4">
      <div className="flex items-center justify-between w-full">
        <Image
          imageUrl={[ndisLogo]}
          imageClass="w-[60px] h-8 object-contain"
          imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
          isCover={false}
          isLazy={true}
          alt="NDIS Logo"
        />
        <div className="toggle-input toggle-input-ndis flex items-center">
          <input
            id="ndis_enable"
            class="toggle-input__input"
            type="checkbox"
            name="ndis_enable"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label for="ndis_enable" class="toggle-input__label">NDIS Enabled</label>
        </div>
      </div>
      {ndisFormTitle && <h3 className="mt-4 text-xl text-custom-2 font-body font-bold">{ndisFormTitle}</h3>}
      {ndisFormDescription && <div className="mt-0.5 text-sm text-custom-2 font-sans" dangerouslySetInnerHTML={{ __html: ndisFormDescription }}></div>}
    </div>
  )
}

export default CartNdis
