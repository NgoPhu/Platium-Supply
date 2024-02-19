import { on, select } from 'helpers/dom'

const selectors = {
  closeNoticeClass: '.js-close-notice',
  autoCloseNoticeClass: '.js-auto-close-notice',
  noticeHideClass: 'notice-hidden'
}

class NoticeMain extends HTMLElement {
  constructor() {
    super()

    this.closeBtn = select(selectors.closeNoticeClass, this)
    this.autoCloseNotice = select(selectors.autoCloseNoticeClass)

    this.addEvents()
  }

  addEvents() {
    if (this.closeBtn) {
      on('click', this.hide.bind(this), this.closeBtn)
      if (this.autoCloseNotice) {
        setTimeout(this.hide.bind(this), 10000)
      }
    }
  }

  hide() {
    this.classList.add(selectors.noticeHideClass)
  }
}

customElements.define('notice-main', NoticeMain)
