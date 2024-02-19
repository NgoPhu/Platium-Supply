import { on, select, addClass, removeClass, getHeight, isIosDevice, toggleClass, hasClass } from 'helpers/dom'
import { disableBodyScroll } from 'body-scroll-lock'
import throttle from 'lodash.throttle'

const selectors = {
  STICKY_CLASS: 'is-sticky',
  ACTIVE_CLASS: 'is-active',
  searchToggleClass: '.js-search-toggle',
  searchBarClass: '.js-search-bar',
  searchBarInputClass: '.js-search-bar-input',
  searchDropdownClass: '.js-search-dropdown',
  STICKY_TOPBAR_CLASS: '.js-sticky-topbar',
  HEADER_STICKY_CLASS: '.js-header-sticky',
  throttleTime: 100,
  PRODUCT_FORM_CLASS: '.js-product-form',
  ANCHOR_CLASS: '.anchor-section',
  TOP_BAR_SELECTOR: '#shopify-section-topbar',
  HEADER_SELECTOR: '#shopify-section-site-header',
  ACCOUNT_TRIGGER_CLASS: '.js-account-trigger',
  ACCOUNT_LIST_CLASS: '.js-account-list',
  ACCOUNT_LOGOUT_HEADER: '.js-account-logout-header',
  MINI_CART_SLIDEOUT: '#MiniCartSlideout',
  MODAL_CONTENT: '.modal-dialog-content'
}

class SiteHeader extends HTMLElement {
  constructor() {
    super()

    this.headerSticky = select(selectors.HEADER_STICKY_CLASS)
    this.stickyTopbar = select(selectors.STICKY_TOPBAR_CLASS)
    this.topBarEl = select(selectors.TOP_BAR_SELECTOR)
    this.headerEl = select(selectors.HEADER_SELECTOR)
    this.accountTriggerEl = select(selectors.ACCOUNT_TRIGGER_CLASS)
    this.accountListEl = select(selectors.ACCOUNT_LIST_CLASS)
    this.menuNavigationHeight = 57
    this.lastScrollTop = 0
    this.headerStickyShowOffset = this.topBarEl ? getHeight(this.topBarEl) + getHeight(this.headerEl) : 0
    this.headerStickyHiddenOffset = this.headerStickyShowOffset - this.menuNavigationHeight
    this.btnLogoutAccountHeader = select(selectors.ACCOUNT_LOGOUT_HEADER)
    this.miniCartSlideout = select(selectors.MINI_CART_SLIDEOUT)
    if (this.miniCartSlideout) {
      this.modalContent = select(selectors.MODAL_CONTENT, this.miniCartSlideout)
    }
    this.attachEvents()
    this.getOffSetTop()
    this.handleScroll()
    this.toggleAccount()
    on(
      'resize',
      throttle(() => {
        this.topbarHeight = window.innerWidth > 1023 ? 42 : 36
        this.modalOffsetTop = window.innerWidth > 1023 ? 122 : 100
      }, selectors.throttleTime),
      window
    )
    on(
      'scroll',
      throttle(() => {
        this.getOffSetTop()
        this.handleScroll()
      }, selectors.throttleTime),
      window
    )
    on('DOMContentLoaded', this.getOffSetTop.bind(this), document)
    on('resize', throttle(this.getOffSetTop.bind(this), selectors.throttleTime), window)

    if (isIosDevice) {
      addClass('ios-device', document.body)
    }
  }

  attachEvents() {
    const searchToggleEl = select(selectors.searchToggleClass)
    const searchBarEl = select(selectors.searchBarClass)
    const searchBarInputEl = select(selectors.searchBarInputClass)
    searchToggleEl &&
      searchBarEl &&
      on(
        'click',
        () => {
          searchBarEl.style.display = 'block'
          const searchDropdownEl = select(selectors.searchDropdownClass)
          searchDropdownEl && disableBodyScroll(searchDropdownEl)
          searchBarInputEl && searchBarInputEl.focus()
        },
        searchToggleEl
      )
  }

  connectedCallback () {
    this.handleLogout()
  }

  handleLogout () {
    this.btnLogoutAccountHeader && on('click', async (e) => {
      e.preventDefault()
      if (window._swat) {
        await window._swat.removeUserFromDevice(window._swat.logoutCleanUp.bind(window._swat))
      }

      window.location.href = '/account/logout'
    }, this.btnLogoutAccountHeader)
  }

  getOffSetTop() {
    const positionTopOffset = this.offsetTop > this.topbarHeight ? 0 : this.getBoundingClientRect().top
    document.body.style.setProperty('--header-offset-top', `${positionTopOffset}px`)
    if (this.modalContent) {
      this.modalContent.style.top = `${this.modalOffsetTop - (this.topbarHeight - positionTopOffset)}px`
    }
  }

  handleScroll() {
    const scrollTopValue = window.pageYOffset || document.documentElement.scrollTop
    if (scrollTopValue > this.lastScrollTop) {
      if (scrollTopValue >= this.headerStickyShowOffset) {
        addClass(selectors.STICKY_CLASS, this.headerEl)
        addClass(selectors.STICKY_CLASS, document.body)
      }
      if (scrollTopValue >= getHeight(this.topBarEl)) {
        addClass(selectors.STICKY_CLASS, document.body)
      }
    } else {
      if (scrollTopValue <= this.headerStickyHiddenOffset) {
        removeClass(selectors.STICKY_CLASS, this.headerEl)
        removeClass(selectors.STICKY_CLASS, document.body)
      }
    }
    this.lastScrollTop = scrollTopValue <= 0 ? 0 : scrollTopValue
  }

  getStickyHeight() {
    let stickyHeight = 0
    const anchorSectionEl = select(selectors.ANCHOR_CLASS)
    const headerStickyHeight = window.innerWidth < 768 ? 56 : 64
    stickyHeight += headerStickyHeight + getHeight(anchorSectionEl)

    return stickyHeight
  }

  toggleAccount() {
    if (this.accountTriggerEl && this.accountListEl) {
      on('click', (e) => {
        const targetList = [this.accountListEl, this.accountTriggerEl]
        if (hasClass(selectors.ACTIVE_CLASS, this.accountListEl) && targetList.every(item => !item.contains(e.target))) {
          removeClass(selectors.ACTIVE_CLASS, this.accountListEl)
          removeClass(selectors.ACTIVE_CLASS, this.accountTriggerEl)
        }
      }, document)

      on('click', (e) => {
        toggleClass(selectors.ACTIVE_CLASS, this.accountTriggerEl)
        toggleClass(selectors.ACTIVE_CLASS, this.accountListEl)
      }, this.accountTriggerEl)
    }
  }
}
customElements.define('site-header', SiteHeader)
