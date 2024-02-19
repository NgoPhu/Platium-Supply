import { select, on, toggleClass } from 'helpers/dom'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import './account-sidebar.css'

const selectors = {
  activeClass: 'active',
  sidebarCurrentClass: '.js-sidebar-current',
  sidebarCurrentTextClass: '.js-sidebar-current-text',
  sidebarCurrentIconClass: '.js-sidebar-current-icon',
  rotateClass: 'rotate-180',
  sidebarNavClass: '.js-sidebar-nav',
  sidebarItemClass: '.js-sidebar-item',
  sidebarItemActiveClass: '.js-sidebar-item.active'
}

class AccountSidebar extends HTMLElement {
  constructor() {
    super()

    this.navEl = select(selectors.sidebarNavClass)
    this.currentEl = select(selectors.sidebarCurrentClass)
    this.currentTextEl = select(selectors.sidebarCurrentTextClass)
    this.currentIconEl = select(selectors.sidebarCurrentIconClass)
    this.itemActiveEl = select(selectors.sidebarItemActiveClass)

    if (this.currentEl && this.navEl) {
      this.setEvents()
      this.setCurrentItem()
    }
  }

  setEvents() {
    on(
      'click',
      () => {
        toggleClass(selectors.activeClass, this.navEl)
        toggleClass(selectors.rotateClass, this.currentIconEl)
        this.onActive()
      },
      this.currentEl
    )
  }

  onActive() {
    if (this.navEl.classList.contains(selectors.activeClass)) {
      disableBodyScroll(this.navEl.firstElementChild)
    } else clearAllBodyScrollLocks()
  }

  setCurrentItem() {
    this.currentTextEl.innerHTML = this.itemActiveEl.innerHTML
  }
}

customElements.define('account-sidebar', AccountSidebar)
