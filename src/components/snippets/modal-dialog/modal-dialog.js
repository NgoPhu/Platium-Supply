import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { on, addClass, selectAll, removeClass } from 'helpers/dom'
import { map } from 'helpers/utils'

const selectors = {
  closeClass: '.js-close-modal-dialog',
  contentClass: '.js-content-modal-dialog',
  openClass: 'modal-dialog-opened',
  overlayClass: 'modal-dialog-overlay',
  validateForm: 'validate-form',
  triggerButtonSelector: '.js-modal-dialog-trigger',
  activeClass: 'active'
}

class ModalDialog extends HTMLElement {
  constructor() {
    super()

    this.init()
  }

  init() {
    this.closeBtn = this.querySelectorAll(selectors.closeClass)
    this.contentEl = this.querySelector(selectors.contentClass)
    this.isSlideOut = this.dataset && this.dataset.type === 'slideout'
    this.scrollTarget = this.getAttribute('data-scroll-target')
    this.attachEvents()
    this.addOverlay()
  }

  attachEvents() {
    this.closeBtn.forEach((btn) => on('click', this.hide.bind(this), btn))
    on('click', this.hide.bind(this), this)
    this.contentEl && on('click', (e) => e.stopPropagation(), this.contentEl)
    on(
      'keyup',
      (event) => {
        if (event.code?.toUpperCase() === 'ESCAPE' || event.keyCode === 27) this.hide()
      },
      this
    )
  }

  addOverlay() {
    if (this.isSlideOut && !this.overlayEl) {
      this.overlayEl = document.createElement('div')
      addClass(selectors.overlayClass, this.overlayEl)
    }
  }

  show(target, init = false) {
    init && this.init()
    /** Hide all opened modal before open new modal */
    const allModals = document.querySelectorAll(selectors.openClass)
    allModals.forEach((modal) => modal.hide())

    this.setAttribute('open', '')
    this.classList.add(selectors.openClass)

    if (!target) {
      const scrollTargetEl = selectAll(this.scrollTarget, this)
      map(disableBodyScroll, [...scrollTargetEl, this.contentEl])
    } else {
      disableBodyScroll(target)
    }

    this.dispatchEvent(new Event('open-modal'))
  }

  hide() {
    /** Refresh validate form when hide modal */
    const allFormsValidate = this.querySelectorAll(selectors.validateForm)
    const modalTriggers = selectAll(selectors.triggerButtonSelector)
    modalTriggers?.length && modalTriggers.forEach((item) => removeClass(selectors.activeClass, item))
    allFormsValidate.forEach((form) => form.refreshValidate())

    this.removeAttribute('open')
    this.classList.remove(selectors.openClass)
    clearAllBodyScrollLocks()
    this.dispatchEvent(new Event('close-modal'))
  }
}

customElements.define('modal-dialog', ModalDialog)

class ModalOpener extends HTMLElement {
  constructor() {
    super()
    this.attachEvents()
  }

  connectedCallback() {
    this.idTrigger = this.getAttribute('data-id')
  }

  attachEvents() {
    this.addEventListener('click', () => {
      const modal = document.querySelector(`modal-dialog[id="${this.idTrigger}"]`)
      modal && modal.show()
    })
  }
}

customElements.define('modal-opener', ModalOpener)
