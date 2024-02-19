import 'lazysizes'
import 'lazysizes/plugins/rias/ls.rias'

import NoticeGlobal from 'snippets/notice-global/notice-global'
import register from 'preact-custom-element'
import LazyLoad from 'vanilla-lazyload'
import SearchBar from 'modules/search-bar/search-bar-searchspring'
import 'styles/theme.css'
import 'snippets/accordion-list/accordion-list'
import 'snippets/carousel/carousel'
import 'snippets/modal-dialog/modal-dialog'
import 'snippets/notice-main/notice-main'
import 'snippets/read-more/read-more'
import 'snippets/validate-form/validate-form'
import 'snippets/video-player/video-player'
import 'snippets/slideout/slideout'
import 'snippets/custom-input-password/custom-input-password'
import 'modules/carousel-swiper/carousel-swiper-register'
import 'modules/carousel-swiper/carousel-swiper-custom'

register(NoticeGlobal, 'notice-global')
register(SearchBar, 'search-bar')

window.lazyLoadInstance = new LazyLoad()
window.addEventListener(
  'LazyLoad::Initialized',
  function (e) {
    console.log(e.detail.instance)
  },
  false
)

window.lazyLoadInstance.update()
