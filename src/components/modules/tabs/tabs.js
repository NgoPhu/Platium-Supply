import { selectAll, on, addClass, removeClass } from 'helpers/dom'

const selectors = {
  tab: '.js-tab',
  tabTitle: 'tab-title',
  tabContent: 'tab-content',
  tabActive: 'active'
}

class Tabs extends HTMLElement {
  constructor () {
    super()

    this.tabTriggers = selectAll(selectors.tabTitle, this)
    this.tabContents = selectAll(selectors.tabContent, this)
    if (this.tabTriggers.length > 0 && this.tabContents.length > 0) {
      this.initActiveTab()
      this.handleActiveTab()
    }
  }

  initActiveTab() {
    this.activeTabByIndex(0)
  }

  activeTabByIndex(index) {
    addClass(selectors.tabActive, this.tabTriggers[index])
    addClass(selectors.tabActive, this.tabContents[index])
  }

  inactiveAllTab() {
    removeClass(selectors.tabActive, this.tabTriggers)
    removeClass(selectors.tabActive, this.tabContents)
  }

  handleActiveTab() {
    this.tabTriggers.forEach((tab, index) => {
      on('click', () => {
        this.inactiveAllTab()
        this.activeTabByIndex(index)
      }, tab)
    })
  }
}

customElements.define('tab-list', Tabs)
