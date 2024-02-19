import { on, select } from 'helpers/dom'

const selectors = {
  logoutBtn: '.js-account-logout'
}

class AccountHeader extends HTMLElement {
  constructor () {
    super()

    this.logoutBtn = select(selectors.logoutBtn, this)
  }

  connectedCallback() {
    this.handleLogout()
  }

  handleLogout () {
    on('click', async (e) => {
      e.preventDefault()

      if (window._swat) {
        await window._swat.removeUserFromDevice(window._swat.logoutCleanUp.bind(window._swat))
      }

      window.location.href = '/account/logout'
    }, this.logoutBtn)
  }
}

customElements.define('account-header', AccountHeader)
