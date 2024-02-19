import { useState } from 'preact/hooks'
import AccountNdisModal from './account-ndis-modal'
import register from 'preact-custom-element'
import Image from 'snippets/image/image'
import Icon from 'snippets/icon/icon'
import './account-ndis.css'

function AccountNdis({ logo, add, edit, type }) {
  return (
    <>
      <div className="flex justify-between items-center mb-5 py-5 px-4 rounded-[10px] border-2 border-custom-2 shadow-base bg-white md:px-6 md:py-6 md:mb-8 md-max:flex-col md-max:gap-4 md-max:items-start">
        {logo && add && edit &&
          <div className={`flex gap-4 items-center md:gap-5 ${!type && ' md-max:hidden'}`}>
            <Image
              imageUrl={[logo]}
              imageClass="w-[55px] h-[30px] object-contain md:w-[66px] md:h-9"
              imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
              isCover={false}
              isLazy={true}
              alt="NDIS Logo"
            />
            <h3 className="text-base text-custom-2 font-bold font-body">{!type ? add : edit}</h3>
          </div>
        }
        <modal-opener data-id="account-ndis-modal" className="h-10 md-max:w-full">
          <div className="button-primary cursor-pointer bg-custom-2 min-h-[40px] py-1.5 md-max:w-full">
            {!type ? 'Add Account' : 'Edit Details'}
          </div>
        </modal-opener>
        {logo && add && edit && !type &&
          <modal-opener data-id="account-ndis-modal" className="md:hidden">
            <div className="flex cursor-pointer items-center justify-between w-full">
              <div className="flex gap-4 items-center md:gap-5">
                <Image
                  imageUrl={[logo]}
                  imageClass="w-[55px] h-[30px] object-contain md:w-[66px] md:h-9"
                  imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
                  isCover={false}
                  isLazy={true}
                  alt="NDIS Logo"
                />
                <h3 className="text-base text-custom-2 font-bold font-body">{add}</h3>
              </div>
              <Icon viewBox="0 0 20 20" name="icon-chevron-forward-outline-thin" className="w-5 h-5 text-custom-2" />
            </div>
          </modal-opener>
        }
      </div>
      <AccountNdisModal type={type} />
    </>
  )
}

register(AccountNdis, 'account-ndis', ['logo', 'add', 'edit', 'type'])
