import { on, selectAll, openModal, getAttribute } from 'helpers/dom'

const selectors = {
  triggerEL: '.js-product-bnpl-trigger'
}

class ProductBNPL extends HTMLElement {
  constructor() {
    super()

    this.triggerListEL = selectAll(selectors.triggerEL, this)
  }

  connectedCallback() {
    this.triggerListEL.forEach((item) => {
      const target = getAttribute('data-target', item)
      on('click', () => {
        this.openModal(target)
      }, item)
    })
  }

  openModal(id) {
    const modal = document.querySelector(`modal-dialog[data-target="${id}"]`)
    modal && modal.show()
  }
}

if (!customElements.get('product-bnpl')) {
  customElements.define('product-bnpl', ProductBNPL)
}
