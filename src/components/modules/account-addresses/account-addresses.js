const selectors = {
  accountAddressFormClass: '.js-account-address-form',
  hiddenClass: 'hidden'
}

class AccountAddresses extends HTMLElement {
  constructor() {
    super()

    this.modal = this.querySelector('modal-dialog')
  }

  toggleForm(key) {
    this.querySelectorAll(selectors.accountAddressFormClass).forEach((addressForm) => {
      addressForm.classList.add(selectors.hiddenClass)
    })
    this.querySelector(`#address-${key}`).classList.remove(selectors.hiddenClass)
    this.modal.show()
  }
}

customElements.define('account-addresses', AccountAddresses)
