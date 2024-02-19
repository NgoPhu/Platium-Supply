import LazyLoad from 'vanilla-lazyload'
import 'styles/theme.css'
import 'snippets/modal-dialog/modal-dialog'
import 'snippets/slideout/slideout'
import 'snippets/validate-form/validate-form'
import 'snippets/custom-input-password/custom-input-password'

window.lazyLoadInstance = new LazyLoad()
window.addEventListener(
  'LazyLoad::Initialized',
  function (e) {
    console.log(e.detail.instance)
  },
  false
)

window.lazyLoadInstance.update()
