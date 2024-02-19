import { getData, addClass, removeClass } from 'helpers/dom'

class ReadMore extends HTMLElement {
  constructor() {
    super()

    this.selectors = {
      ACTIVE_CLASS: 'is-active',
      READ_MORE_CLASS: 'read-more'
    }
    this.options = {
      snippet: '[more]',
      limit: Number(this.getAttribute('data-limit')) || 0
    }
    this.content = {
      before: this.innerHTML,
      after: ''
    }
    this.label = {
      readMore: this.dataset.more || 'Read more',
      readLess: this.dataset.less || 'Read less'
    }
    this.labelCustom = {
      labelExpland: this.getAttribute('data-labelExpland') || '',
      labelCollapse: this.getAttribute('data-labelCollapse') || ''
    }
    this.isExpand = false

    this.setupButtonLoadMore()
    this.getOptions()
    this.setupLoadMore().then(this.collapse.bind(this))

    if (this.innerHTML.indexOf(this.options.snippet) !== -1) {
      addClass(this.selectors.READ_MORE_CLASS, this)
    }
  }

  connectedCallback() {
    this.bindEvents()
  }

  getOptions() {
    this.options.snippet = getData('snippet', this) || this.options.snippet
    this.options.limit = getData('limit', this) || this.options.limit
  }

  bindEvents() {
    this.buttonLoadMore.addEventListener('click', () => {
      if (!this.isExpand) {
        this.expand()
      } else this.collapse()
    })
  }

  setupButtonLoadMore() {
    this.buttonLoadMore = document.createElement('span')
    this.buttonLoadMore.classList = 'link normal-case read-more-button'
  }

  setupLoadMore() {
    return new Promise((resolve) => {
      if (this.options.limit > 0) {
        this.splitByLimit(resolve)
      } else if (this.innerHTML.indexOf(this.options.snippet) !== -1) {
        this.content.before = this.innerHTML.split(this.options.snippet)[0]
        this.content.after = this.innerHTML.split(this.options.snippet)[1]
        resolve()
      }
    })
  }

  splitByLimit(resolve) {
    const splitContent = this.innerHTML
      .split(/(<[^>]+>)/g)
      .filter((s) => s.trim())
      .map((s) => s.replace(/&amp;/g, '&'))

    const contentTrim = splitContent.join('')
    const textContent = splitContent.filter((s) => !/<[^>]+>/g.test(s)).join(' ')

    let limit = Number(this.options.limit)
    let counterLength = 0

    if (textContent.length <= this.options.limit) return

    if (splitContent.length > 2) {
      splitContent.forEach((item) => {
        counterLength += item.length

        if (/<[^>]+>/g.test(item)) {
          if (limit > counterLength) {
            limit += item.length
          } else {
            this.content.before = contentTrim.slice(0, limit)
            this.content.after = contentTrim.slice(limit + 1, contentTrim.length)
            resolve()
          }
        }
      })
    } else if (splitContent.length !== 0) {
      this.content.before = contentTrim.slice(0, limit)
      this.content.after = contentTrim.slice(limit + 1, contentTrim.length)
      resolve()
    }
  }

  expand() {
    this.isExpand = true
    this.innerHTML = this.content.before + this.content.after
    if (this.labelCustom.labelExpland !== '') {
      this.buttonLoadMore.innerHTML = this.labelCustom.labelExpland
    } else {
      this.buttonLoadMore.innerHTML = this.label.readLess
    }
    addClass(this.selectors.ACTIVE_CLASS, this)
    this.append('\u00A0') // add space
    this.appendChild(this.buttonLoadMore)
  }

  collapse() {
    this.isExpand = false
    this.innerHTML = this.content.before
    if (this.labelCustom.labelCollapse !== '') {
      this.buttonLoadMore.innerHTML = this.labelCustom.labelCollapse
    } else {
      this.buttonLoadMore.innerHTML = this.label.readMore
    }
    removeClass(this.selectors.ACTIVE_CLASS, this)
    this.append('\u2026') // add ellipis
    this.appendChild(this.buttonLoadMore)
  }
}

customElements.define('read-more', ReadMore)
