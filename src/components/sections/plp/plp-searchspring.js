import register from 'preact-custom-element'
import PlpSearchSpring from 'snippets/plp-searchspring/plp-searchspring'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

register(PlpSearchSpring, 'plp-searchspring')
