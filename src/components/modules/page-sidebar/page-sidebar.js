import { select, selectAll, on, ready } from 'helpers/dom'

const selectors = {
  OPTION_CLASS: '.js-option',
  SELECT_CLASS: '.js-select'
}

class PageSidebar extends HTMLElement {
  constructor() {
    super()

    this.selectEl = select(selectors.SELECT_CLASS, this)
    this.optionList = selectAll(selectors.OPTION_CLASS, this)
    this.attachEvent()
  }

  attachEvent() {
    ready(() => {
      this.optionList.forEach((el) => {
        if (el.value === window.location.pathname) {
          el.selected = true
        }
      })
    })

    on('change', (e) => {
      window.location.href = e.target.value
    }, this.selectEl)
  }
}

if (!customElements.get('page-sidebar')) {
  customElements.define('page-sidebar', PageSidebar)
}
