import register from 'preact-custom-element'
import { select } from 'helpers/dom'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

const selectors = {
  buttonSubmit: 'button[type="submit"]',
  validateForm: 'validate-form',
  form: 'form'
}

class AccountMyDetails extends HTMLElement {
  constructor() {
    super()

    register(LoaderSpin, 'loader-spin')

    this.buttonSubmit = select(selectors.buttonSubmit, this)
    this.validateForm = select(selectors.validateForm, this)
    this.form = select(selectors.form, this.validateForm)

    this.buttonSubmit.addEventListener('click', (e) => {
      e.preventDefault()

      this.validateForm.revalidate(() => {
        if (this.form.requestSubmit) {
          this.form.requestSubmit()
        } else {
          this.form.dispatchEvent(new Event('submit'))
        }
      })
    })
  }
}

if (!customElements.get('account-my-details')) {
  customElements.define('account-my-details', AccountMyDetails)
}
