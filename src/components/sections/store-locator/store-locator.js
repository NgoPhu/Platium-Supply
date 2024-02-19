import { delegate, select, selectAll, addClass, hasClass, toggleClass } from 'helpers/dom'
import { map } from 'helpers/utils'
import './store-locator.css'

const CUSTOM_FIELD_SELECTOR = '.stockist-result-custom-field'
const CUSTOM_FIELD_HOURS_SELECTOR = 'stockist-result-custom-field--hours'
const CUSTOM_FIELD_LINK_SELECTOR = 'stockist-result-custom-field--link'
const CUSTOM_FIELD_PHONE_SELECTOR = 'stockist-result-custom-field--phone'
const FILTER_CHECKBOX_SELECTOR = '.stockist-search-filter-checkbox > label'
const FILTER_CHECKBOX_CLASS_ACTIVE = 'stockist-search-filter-checkbox--active'
const RESULT_SELECTOR = '.stockist-list-result'
const INITIALIZED_CLASS = 'is-initialized'
const PHONE_TEXT = 'Phone'
const STORE_HOUR_TEXT = 'Store hours'

class StoreLocator extends HTMLElement {
  constructor() {
    super()

    delegate(
      'click',
      () => {
        this.resultTimer = setInterval(this.swap, 300)
      },
      RESULT_SELECTOR,
      this
    )
    this.initTimer = setInterval(this.swap, 300)
    delegate('click', (e) => this.activeCheckbox(e.target), FILTER_CHECKBOX_SELECTOR, this)
  }

  activeCheckbox(target) {
    this.checkboxEls = selectAll(FILTER_CHECKBOX_SELECTOR)
    // eslint-disable-next-line array-callback-return
    this.checkboxEls.map((item) => {
      if (item === target) {
        toggleClass(FILTER_CHECKBOX_CLASS_ACTIVE, target)
      }
    })
  }

  swap() {
    this.customFieldEls = selectAll(CUSTOM_FIELD_SELECTOR)
    map((customFieldEl) => {
      const labelEl = select('span', customFieldEl)

      if (!hasClass(INITIALIZED_CLASS, customFieldEl)) {
        const fieldContent = customFieldEl.innerText
        const phoneIndex = fieldContent.indexOf(PHONE_TEXT)
        if (phoneIndex > -1) {
          addClass(CUSTOM_FIELD_PHONE_SELECTOR, customFieldEl)
        }

        // Try to wrap Store hours in another div
        if (labelEl && labelEl.innerHTML === STORE_HOUR_TEXT) {
          addClass(CUSTOM_FIELD_HOURS_SELECTOR, customFieldEl)
          let markupHtml = customFieldEl.innerHTML
          // Remove label text in this markup
          markupHtml = markupHtml.replace('<span>' + STORE_HOUR_TEXT + '</span>', '')
          // Change to <ul>, <li> markup
          markupHtml = '<ul><li><span>' + markupHtml.replace(/\|/g, '</span></li><li><span>') + '</span></li></ul>'
          markupHtml = markupHtml.replace(/: /g, '</span><span>')

          customFieldEl.innerHTML = `
            <accordion-list>
              <div class="accordion-item js-accordion-item" data-aria-accordion>
                <button class="accordion-item-title js-accordion-button" aria-controls="" aria-expanded="false" type="button">
                ${STORE_HOUR_TEXT}
                <span class="accordion-item-icon">
                  <svg viewBox="0 0 20 20" class="icon accordion-item-icon-open" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="icon-plus" d="M10 4.375v11.25M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <svg viewBox="0 0 20 20" class="icon accordion-item-icon-close" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path id="icon-minus" d="M15.625 10H4.375" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </span>
              </button>
              <div id="" class="accordion-item-description js-accordion-content" data-aria-accordion-panel>
                <div class="accordion-item-description-content pb-5">
                  ${markupHtml}
                </div>
              </div>
              </div>
            </accordion-list>
          `
        }
        const link = select('a', customFieldEl)
        if (link) {
          addClass(CUSTOM_FIELD_LINK_SELECTOR, customFieldEl)
          link.textContent = 'View the menu'
        }
        addClass(INITIALIZED_CLASS, customFieldEl)
      }
    }, this.customFieldEls)

    clearInterval(this.resultTimer)
    clearInterval(this.initTimer)
  }
}

customElements.define('store-locator', StoreLocator)
