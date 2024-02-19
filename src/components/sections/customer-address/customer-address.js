class CustomerAddress {
  constructor() {
    this.initCustomerAddress()
    this.customerAddressesSelector()
    this.initDeleteAddressButtons()
  }

  initDeleteAddressButtons() {
    const deleteButtons = document.querySelectorAll('button[data-delete-address]')
    if (deleteButtons.length < 1) return

    deleteButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const url = this.dataset.url

        const confirmation = window.confirm('Do you really wish to delete this address?')

        if (confirmation) {
          document.querySelector(`form[action="${url}"]`).submit()
        }
      })
    })
  }

  initCustomerAddress() {
    const allAddressesSelector = document.querySelectorAll('select[data-country-selector]')
    if (allAddressesSelector.length < 1) return

    allAddressesSelector.forEach((select) => {
      const selectedCountry = this.getSelectedCountry(select)

      if (!selectedCountry) return

      const provinces = selectedCountry.dataset.provinces
      const arrayOfProvince = JSON.parse(provinces)

      const provinceSelector = document.querySelector(`#address_province_${select.dataset.id}`)

      if (arrayOfProvince.length < 1) {
        provinceSelector.setAttribute('disabled', 'disabled')
      } else {
        provinceSelector.removeAttribute('disabled')
      }

      provinceSelector.innerHTML = ''
      let options = ''
      for (let index = 0; index < arrayOfProvince.length; index++) {
        if (arrayOfProvince[index][0] === provinceSelector.getAttribute('value')) {
          options += `<option value="${arrayOfProvince[index][0]}" selected>${arrayOfProvince[index][0]}</option>`
        } else {
          options += `<option value="${arrayOfProvince[index][0]}">${arrayOfProvince[index][0]}</option>`
        }
      }

      provinceSelector.innerHTML = options
    })
  }

  getSelectedCountry(select) {
    let option, selectedOption
    for (let index = 0; index < select.options.length; index++) {
      option = select.options[index]

      if (option.value === select.getAttribute('value')) {
        selectedOption = option
        selectedOption.setAttribute('selected', 'selected')
        break
      }
    }

    return selectedOption
  }

  customerAddressesSelector() {
    const addressesSelector = document.querySelectorAll('select[data-country-selector]')
    if (addressesSelector.length < 1) return

    addressesSelector.forEach((select) => {
      select.addEventListener('change', function () {
        const provinces = this.options[this.selectedIndex].dataset.provinces
        const arrayOfProvince = JSON.parse(provinces)

        const provinceSelector = document.querySelector(`#address_province_${this.dataset.id}`)

        if (arrayOfProvince.length < 1) {
          provinceSelector.setAttribute('disabled', 'disabled')
        } else {
          provinceSelector.removeAttribute('disabled')
        }

        provinceSelector.innerHTML = ''
        let options = ''
        for (let index = 0; index < arrayOfProvince.length; index++) {
          options += `<option value="${arrayOfProvince[index][0]}">${arrayOfProvince[index][0]}</option>`
        }

        provinceSelector.innerHTML = options
      })
    })
  }
}

/* eslint-disable */
new CustomerAddress()
/* eslint-enable */
