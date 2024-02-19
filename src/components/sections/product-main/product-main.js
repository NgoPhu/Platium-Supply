import { setRecentlyProducts } from 'uses/useRecentlyProduct'
import register from 'preact-custom-element'
import ProductInfo from 'snippets/product-info/product-info'
import ProductAvailable from 'snippets/product-info/product-available'
import ProductForm from 'snippets/product-form/product-form'
import ProductBadge from 'snippets/product-badge/product-badge'
import AnchorSection from 'snippets/anchor-section/anchor-section'
import PlpUser from 'snippets/plp-user/plp-user'
import EstimateShipping from 'snippets/estimate-shipping/estimate-shipping'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

class ProductMain extends HTMLElement {
  constructor() {
    super()
    setRecentlyProducts(this.dataset.handle)

    if (localStorage.getItem('return_to')) {
      localStorage.removeItem('return_to')
    }
  }
}

register(ProductInfo, 'product-info')
register(ProductAvailable, 'product-available')
register(ProductForm, 'product-form')
register(ProductBadge, 'product-badge')
register(AnchorSection, 'anchor-section')
register(PlpUser, 'plp-user')
register(EstimateShipping, 'estimate-shipping')

customElements.define('product-main', ProductMain)
