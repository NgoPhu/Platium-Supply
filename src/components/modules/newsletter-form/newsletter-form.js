import { initValidate } from 'helpers/validate'

const selectors = {
  newsletterForm: '.js-newsletter-form',
  newsletterFormDuplicate: '.js-newsletter-form-duplicate',
  newsletterFormFailed: '.js-newsletter-form-failed',
  newsletterFormSuccess: '.js-newsletter-form-success'
}

class NewsletterForm extends HTMLElement {
  constructor() {
    super()

    this.formWrapper = this.querySelector(selectors.newsletterForm)
    this.form = this.formWrapper.querySelector('form')
    this.messageDuplicated = this.querySelector(selectors.newsletterFormDuplicate)
    this.messageFailed = this.querySelector(selectors.newsletterFormFailed)
    this.messageSuccess = this.querySelector(selectors.newsletterFormSuccess)
    const validate = initValidate(this.form, true)

    validate.onSuccess((event) => {
      event.preventDefault()
      this.onSubmitForm(this.form)
    })
  }

  async onSubmitForm(form) {
    const data = new FormData(form)
    const req = await fetch('https://a.klaviyo.com/ajax/subscriptions/subscribe', {
      method: 'POST',
      body: data
    })

    if (req.status === 200) {
      const res = await req.json()

      if (res.errors.length > 0 && !res.success) {
        this.messageFailed.innerHTML = res.errors[0]
        this.messageFailed.classList.add('!block')
      } else {
        if (res.data.is_subscribed) {
          this.messageDuplicated.classList.add('!block')
        } else {
          this.formWrapper.classList.add('hidden')
          this.messageSuccess.classList.remove('hidden')
        }
      }
    }
  }
}

if (!customElements.get('newsletter-form')) {
  customElements.define('newsletter-form', NewsletterForm)
}
