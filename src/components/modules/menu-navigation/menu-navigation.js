import { select, on, selectAll, addClass, removeClass, hasClass } from 'helpers/dom'
import debounce from 'lodash.debounce'

const DELAY = 0
const selectors = {
  MENU_NAVIGATION_SELECTOR: '.js-menu-navigation',
  MENU_NAVIGATION_BANNER_SELECTOR: '.js-menu-navigation-banner',
  NAV_DROPDOWN_SELECTOR: '.js-nav-dropdown',
  NAV_DROPDOWN_ITEM_SELECTOR: '.js-nav-dropdown-item',
  ACTIVE_CLASS: 'is-active',
  HIDDEN_CLASS: 'hidden',
  HOVER_CLASS: 'hover',
  DATA_COUNT_BANNER_ATTRIBUTE: 'data-count-banner',
  ONE_BANNER_WIDTH: 264,
  TWO_BANNER_WIDTH: 560
}

class MenuNavigation extends HTMLElement {
  constructor() {
    super()
    this.menuNavigation = select(selectors.MENU_NAVIGATION_SELECTOR, this)
    this.navDropdown = select(selectors.NAV_DROPDOWN_SELECTOR, this)
    this.navDropdownItems = selectAll(selectors.NAV_DROPDOWN_ITEM_SELECTOR, this)
    this.attachEvent()
  }

  attachEvent() {
    if (this.menuNavigation && this.menuNavigation.children.length > 0) {
      for (let i = 0; i < this.menuNavigation.children.length; i++) {
        on(
          'mouseover',
          debounce(() => {
            if (this.menuNavigation.children[i].hasAttribute('data-dropdown')) {
              addClass(selectors.ACTIVE_CLASS, this)
            } else {
              removeClass(selectors.ACTIVE_CLASS, this)
            }
            this.navDropdownItems.forEach((item) => addClass(selectors.HIDDEN_CLASS, item))
            removeClass(selectors.HIDDEN_CLASS, this.navDropdown.children[i])
            this.navDropdown.style.height = this.navDropdown.children[i].scrollHeight + 'px'
            addClass(selectors.HOVER_CLASS, this.menuNavigation.children[i].children[0])
            this.customBanner(this.navDropdown.children[i])
          }, DELAY),
          this.menuNavigation.children[i]
        )

        on(
          'mouseout',
          debounce(() => {
            this.navDropdown.style.height = 0
            removeClass(selectors.ACTIVE_CLASS, this)
            removeClass(selectors.HOVER_CLASS, this.menuNavigation.children[i].children[0])
          }, DELAY),
          this.menuNavigation.children[i]
        )
      }
    }

    if (this.navDropdownItems && this.navDropdownItems.length > 0) {
      this.navDropdownItems.forEach((item, index) => {
        on(
          'mouseover',
          () => {
            this.navDropdown.style.height = item.scrollHeight + 'px'
            if (!hasClass(selectors.ACTIVE_CLASS, this)) {
              addClass(selectors.ACTIVE_CLASS, this)
            }
            addClass(selectors.HOVER_CLASS, this.menuNavigation.children[index].children[0])
          },
          item
        )

        on(
          'mouseout',
          () => {
            this.navDropdown.style.height = 0
            removeClass(selectors.ACTIVE_CLASS, this)
            removeClass(selectors.HOVER_CLASS, this.menuNavigation.children[index].children[0])
          },
          item
        )
      })
    }
  }

  setDataCountBanner(el, count) {
    el?.setAttribute(selectors.DATA_COUNT_BANNER_ATTRIBUTE, count || '')
  }

  customBanner(el) {
    const navBanner = select(selectors.MENU_NAVIGATION_BANNER_SELECTOR, el)
    this.setDataCountBanner(navBanner)

    const navBannerOffsetWidth = navBanner?.offsetWidth
    if (navBannerOffsetWidth < selectors.TWO_BANNER_WIDTH) {
      if (navBannerOffsetWidth < selectors.ONE_BANNER_WIDTH) {
        this.setDataCountBanner(navBanner, '0')
      } else {
        this.setDataCountBanner(navBanner, 1)
      }
    } else {
      this.setDataCountBanner(navBanner)
    }
  }
}

customElements.define('menu-navigation', MenuNavigation)
