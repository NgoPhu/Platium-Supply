/* global globalEvents */
import { on, selectAll, closest, addClass } from 'helpers/dom'
import { eventProps } from 'helpers/global'

const selectors = {
  MODAL_SELECTOR: 'modal-dialog',
  TRIGGER_BUTTON_SELECTOR: '.js-modal-dialog-trigger'
}

const modalEls = selectAll(selectors.MODAL_SELECTOR)
const buttonEls = selectAll(selectors.TRIGGER_BUTTON_SELECTOR)

if (modalEls.length > 0 && buttonEls.length > 0) {
  buttonEls.forEach((item) => {
    on(
      'click',
      (e) => {
        const targetElement = closest(selectors.TRIGGER_BUTTON_SELECTOR, e.target)
        if (targetElement && targetElement.id) {
          modalEls.find((modal) => modal.dataset.target === targetElement.id).show()
          if (targetElement.id === 'MiniCart') {
            addClass('active', targetElement)
            globalEvents.emit(eventProps.cart.render, true)
          }
        } else {
          modalEls.find((modal) => modal.dataset.target === e.target.id).show()
        }
      },
      item
    )
  })
}
