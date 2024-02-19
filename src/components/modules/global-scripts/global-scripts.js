import ee from 'event-emitter'
import { hideModal } from 'helpers/dom'

function GlobalEvents() {}
ee(GlobalEvents.prototype)

const globalEvents = new GlobalEvents()
window.globalEvents = globalEvents

if (!window.globalEvents) {
  setTimeout(() => {
    const reCreateGlobalEvents = new GlobalEvents()
    window.globalEvents = reCreateGlobalEvents
  }, 200)
}

window.addEventListener('popstate', () => {
  hideModal('MiniCart')
})
