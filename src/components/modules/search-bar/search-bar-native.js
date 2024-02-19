import debounce from 'lodash.debounce'
import { select, on, addClass, removeClass } from 'helpers/dom'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const selectors = {
  isOpenAttr: 'is-open',
  isResultsAttr: 'is-results',
  inputEl: 'input[type="search"]',
  resultsEl: '#SearchSuggestionResults',
  formEl: '#SearchSuggestionForm',
  searchResultListClass: '.js-search-result-list',
  linkToArticleEl: '.js-link-article',
  DROPDOWN_RESULTS: '.js-dropdown',
  predictSearch: '#predictive-search-results',
  overlaySearch: '.search-overlay',
  triggerCloseEl: '.js-trigger-close'
}

class SearchBarNative extends HTMLElement {
  constructor() {
    super()
    this.cachedResults = {}
    this.input = select(selectors.inputEl, this)
    this.predictiveResults = select(selectors.resultsEl, this)
    this.overlaySearch = select(selectors.overlaySearch, this)
    this.triggerCloseEl = select(selectors.triggerCloseEl, this)
    this.isOpen = false

    this.handleEventListener()
  }

  handleEventListener() {
    const formEl = select(selectors.formEl, this)

    on('submit', this.onSubmit.bind(this), formEl)

    on(
      'input',
      debounce((event) => {
        this.onChange(event)
      }, 300).bind(this),
      this.input
    )

    on('focus', this.onFocus.bind(this), this.input)
    on('keyup', this.onKeyup.bind(this), this)
    on('keydown', this.onKeydown.bind(this), this)

    on('click', () => {
      this.onClose(true)
    }, this.overlaySearch)

    on('click', () => {
      this.onClose(true)
    }, this.triggerCloseEl)
  }

  getSearchQuery() {
    return this.input.value.trim()
  }

  onChange() {
    const searchTerm = this.getSearchQuery()

    if (!searchTerm.length) {
      this.onClose(true)
      return
    }

    this.getResults(searchTerm)
  }

  onSubmit(event) {
    if (
      !this.getSearchQuery().length ||
      this.querySelector('[aria-selected="true"] a')
    ) {
      event.preventDefault()
    }
  }

  onFocus() {
    const searchTerm = this.getSearchQuery()

    if (!searchTerm.length) return

    if (this.getAttribute(selectors.isResultsAttr) === 'true') {
      this.onOpen()
    } else {
      this.getResults(searchTerm)
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.onClose()
    })
  }

  onKeyup(event) {
    if (!this.getSearchQuery().length) this.onClose(true)
    event.preventDefault()

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up')
        break
      case 'ArrowDown':
        this.switchOption('down')
        break
      case 'Enter':
        this.selectOption()
        break
    }
  }

  onKeydown(event) {
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault()
    }

    const linkArticle = select(selectors.linkToArticleEl, this)
    if (linkArticle && event.code === 'Enter') {
      event.preventDefault()
      linkArticle.click()
    }
  }

  switchOption(direction) {
    if (!this.getAttribute(selectors.isOpenAttr)) return

    const moveUp = direction === 'up'
    const selectedElement = this.querySelector('[aria-selected="true"]')
    const allElements = this.querySelectorAll('li')
    let activeElement = this.querySelector('li')

    if (moveUp && !selectedElement) return

    this.statusElement.textContent = ''

    if (!moveUp && selectedElement) {
      activeElement = selectedElement.nextElementSibling || allElements[0]
    } else if (moveUp) {
      activeElement =
        selectedElement.previousElementSibling ||
        allElements[allElements.length - 1]
    }

    if (activeElement === selectedElement) return

    activeElement.setAttribute('aria-selected', true)
    if (selectedElement) selectedElement.setAttribute('aria-selected', false)
    this.input.setAttribute('aria-activedescendant', activeElement.id)
  }

  selectOption() {
    const selectedProduct = this.querySelector(
      '[aria-selected="true"] a, [aria-selected="true"] button'
    )

    if (selectedProduct) selectedProduct.click()
  }

  getResults(searchTerm) {
    const queryKey = searchTerm.replace(' ', '-').toLowerCase()
    this.setFetching(true)

    if (this.cachedResults[queryKey]) {
      this.renderResults(this.cachedResults[queryKey])
      return
    }

    fetch(
      `${window.GM_STATE.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}
      &section_id=predictive-search`
    )
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status)
          this.onClose()
          throw error
        }

        return response.text()
      })
      .then((text) => {
        const html = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML
        this.cachedResults[queryKey] = html
        this.renderResults(html)
      })
      .catch((error) => {
        this.onClose()
        throw error
      })
  }

  setFetching(status) {
    if (status) {
      this.setAttribute('loading', true)
    } else {
      this.removeAttribute('loading')
    }
  }

  renderResults(html) {
    this.predictiveResults.innerHTML = html
    this.setAttribute(selectors.isResultsAttr, true)
    this.setFetching(false)
    this.onOpen()
  }

  onOpen() {
    const dropDownEL = this.querySelector(selectors.DROPDOWN_RESULTS)
    const resultListEl = this.querySelector(selectors.searchResultListClass)

    addClass(selectors.isOpenAttr, this)
    addClass('active', this.predictiveResults)
    this.setAttribute(selectors.isOpenAttr, true)
    this.input.setAttribute('aria-expanded', true)
    this.isOpen = true

    if (window.innerWidth < 1024) {
      disableBodyScroll(dropDownEL)
    } else {
      disableBodyScroll(resultListEl)
    }
  }

  onClose(clearTerm = false) {
    if (clearTerm) {
      this.input.value = ''
      this.removeAttribute(selectors.isResultsAttr)
    }

    const selected = this.querySelector('[aria-selected="true"]')
    const resultListEl = this.querySelector(selectors.DROPDOWN_RESULTS)

    if (selected) selected.setAttribute('aria-selected', false)

    this.input.setAttribute('aria-activedescendant', '')
    this.removeAttribute(selectors.isOpenAttr)
    removeClass(selectors.isOpenAttr, this)
    removeClass('active', this.predictiveResults)
    this.input.setAttribute('aria-expanded', false)

    this.isOpen = false
    clearAllBodyScrollLocks()
  }
}

if (!customElements.get('search-bar-native')) {
  customElements.define('search-bar-native', SearchBarNative)
}
