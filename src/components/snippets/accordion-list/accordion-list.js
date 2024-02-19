const selectors = {
  itemClass: '.js-accordion-item',
  buttonClass: '.js-accordion-button',
  contentClass: '.js-accordion-content',
  accordionButtonCap: '.accordion-heading-capitalize .js-accordion-button .text'
}

class AccordionList extends HTMLElement {
  constructor() {
    super()

    this.init()
  }

  close(items) {
    items.forEach((item) => {
      const content = item.querySelector(selectors.contentClass)
      const button = item.querySelector(selectors.buttonClass)
      if (button && content) {
        content.style.maxHeight = '0px'
        button.setAttribute('aria-expanded', 'false')
        item.removeAttribute('open')
      }
    })
  }

  open(item) {
    const content = item.querySelector(selectors.contentClass)
    const button = item.querySelector(selectors.buttonClass)
    content.style.maxHeight = content.children[0].scrollHeight + 'px'
    button.setAttribute('aria-expanded', 'true')
    item.setAttribute('open', true)
  }

  toggleDescription(item, list) {
    if (item && !item.hasAttribute('open')) {
      this.close(list)
      this.open(item)
    } else {
      this.close(list)
    }
  }

  init() {
    const list = this.querySelectorAll(selectors.itemClass)
    if (list.length) {
      list.forEach((item) => {
        const button = item.querySelector(selectors.buttonClass)
        const textTitle = item.querySelector(selectors.accordionButtonCap)
        if (textTitle) {
          textTitle.innerHTML = textTitle.innerHTML.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase())
        }
        if (item.hasAttribute('open')) {
          this.open(item)
        }
        if (button) {
          const _this = this
          button.onclick = function (e) {
            if (location.pathname.includes('store-locator')) {
              e.stopPropagation()
            }
            _this.toggleDescription(item, list)
          }
        }
      })
    }
  }
}

customElements.define('accordion-list', AccordionList)
