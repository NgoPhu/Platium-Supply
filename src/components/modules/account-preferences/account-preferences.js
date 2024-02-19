class AccountPreferences extends HTMLElement {
  constructor() {
    super()

    this.addEventListener('change', this.onChange.bind(this))
  }

  onChange(e) {
    e.target.value = e.target.checked
    e.target.dispatchEvent(new Event('change'))
  }
}

if (!customElements.get('account-preferences')) {
  customElements.define('account-preferences', AccountPreferences)
}
