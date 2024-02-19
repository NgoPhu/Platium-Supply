import { initValidate } from 'helpers/validate'
import { selectAll } from 'helpers/dom'

class ValidateForm extends HTMLElement {
  constructor() {
    super()
    this.submitDelay = this.hasAttribute('data-submit-delay')

    setTimeout(() => {
      const formIds = this.getFormIds()
      if (formIds.length) {
        formIds.forEach((form) => {
          if (form.id && selectAll('input:not([type=hidden]), select', form).length) {
            this.validate = initValidate(form, this.submitDelay)
          }
        })
      }
    }, 200)
  }

  refreshValidate() {
    this.validate.refresh()
  }

  revalidate(success, failed) {
    this.validate.revalidate().then((isValid) => {
      if (isValid && typeof success === 'function') success()
      else if (!isValid && typeof failed === 'function') failed()
    })
  }

  getFormIds() {
    const els = selectAll('form', this)
    return els
  }
}

customElements.define('validate-form', ValidateForm)
