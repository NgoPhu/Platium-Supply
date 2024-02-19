import { select, addClass, removeClass } from 'helpers/dom'

const selectors = {
  SHOWPASSWORD: '.js-show-password',
  IS_SHOW_PASSWORD: 'is-show-password',
  INPUT: 'input'
}

class CustomInputPassword extends HTMLElement {
  constructor() {
    super()

    this.buttonShow = select(selectors.SHOWPASSWORD, this)
    this.input = select(selectors.INPUT, this)
    this.attackEvent()
  }

  attackEvent() {
    if (this.buttonShow) {
      this.buttonShow.addEventListener('click', () => {
        if (this.input.type === 'password') {
          this.input.type = 'text'
          addClass(selectors.IS_SHOW_PASSWORD, this.buttonShow)
        } else {
          this.input.type = 'password'
          removeClass(selectors.IS_SHOW_PASSWORD, this.buttonShow)
        }
      })
    }
  }
}

customElements.define('custom-input-password', CustomInputPassword)
