import register from 'preact-custom-element'
import PlpNative from 'snippets/plp-native/plp-native'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

register(PlpNative, 'plp-native')
