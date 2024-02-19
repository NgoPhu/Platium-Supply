import './image-zoom.css'

export default class ImageZoom extends HTMLImageElement {
  constructor() {
    super()
    this.state = this.initState
    this.options = {
      maxScale: this.getAttribute('data-max-scale') || 2,
      minScale: this.getAttribute('data-min-scale') || 1,
      zoomOnHover: this.hasAttribute('data-zoom-on-hover'),
      zoomOnWheel: this.hasAttribute('data-zoom-on-wheel'),
      zoomOnPinch: this.hasAttribute('data-zoom-on-pinch'),
      zoomOnDoubleClick: this.hasAttribute('data-zoom-on-double-click')
    }

    this.timer = null
  }

  get initState() {
    return new Proxy(
      {
        scale: 1,
        panning: false,
        pointX: 0,
        pointY: 0,
        start: {
          x: 0,
          y: 0,
          distance: 0
        },
        last: {
          x: 0,
          y: 0,
          distance: 0
        },
        tap: 0,
        zooming: false
      },
      this.stateUpdateHandler()
    )
  }

  connectedCallback() {
    this.attachEvents()
  }

  attachEvents() {
    this.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.addEventListener('wheel', this.onMouseWheel.bind(this))
    this.addEventListener('touchstart', this.onTouchStart.bind(this))
    this.addEventListener('touchmove', this.onTouchMove.bind(this))
    this.addEventListener('touchend', this.onTouchEnd.bind(this))
    this.addEventListener('dblclick', this.onDoubleClick.bind(this))
  }

  stateUpdateHandler() {
    return {
      set: (obj, prop, value) => {
        if (obj[prop] !== value) {
          obj[prop] = value
          this.onStateUpdate()
        }
        return true
      }
    }
  }

  onStateUpdate() {
    this.updateStyle()
    this.onZooming()
  }

  updateStyle() {
    this.style.transform = [`translate3d(${this.state.pointX}px, ${this.state.pointY}px, 0px)`, `scale(${this.state.scale})`].join(' ')
  }

  onZooming() {
    if (this.state.zooming) {
      this.dispatchEvent(new CustomEvent('zooming'))
    }
  }

  reset() {
    this.state = this.initState
    this.updateStyle()
  }

  distance(e) {
    return Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY)
  }

  zoomOnMouse(e, scaleDelta = this.options.maxScale) {
    let x = 0
    let y = 0
    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
      const touch = e.touches[0] || e.changedTouches[0]
      x = touch.pageX
      y = touch.pageY
    } else if (
      e.type === 'mousedown' ||
      e.type === 'mouseup' ||
      e.type === 'mousemove' ||
      e.type === 'mouseover' ||
      e.type === 'mouseout' ||
      e.type === 'mouseenter' ||
      e.type === 'mouseleave' ||
      e.type === 'click' ||
      e.type === 'wheel' ||
      e.type === 'mousewheel' ||
      e.type === 'dblclick'
    ) {
      x = e.clientX
      y = e.clientY
    }

    if (this.state.panning || this.state.zooming) {
      this.state.scale = scaleDelta
      this.state.pointX = -Math.floor(x * (this.state.scale - 1))
      this.state.pointY = -Math.floor(y * (this.state.scale - 1))
      this.state.zooming = true
    }
  }

  onMouseDown(e) {
    e.preventDefault()
    this.state.start = {
      x: e.clientX - this.state.pointX,
      y: e.clientY - this.state.pointY
    }
    this.state.panning = true
  }

  onMouseEnter(e) {
    if (this.options.zoomOnHover) {
      this.state.zooming = true
    }
  }

  onMouseMove(e) {
    e.preventDefault()
    if (this.options.zoomOnHover) {
      this.zoomOnMouse(e)
    }
  }

  onMouseUp(e) {
    this.state.panning = false
  }

  onMouseLeave(e) {
    if (this.options.zoomOnHover) {
      this.reset()
    }
  }

  onMouseWheel(e) {
    e.preventDefault()
    if (this.options.zoomOnWheel) {
      const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY
      let scale = this.state.scale
      const scaleDelta = 0.1
      if (delta > 0 && scale < this.options.maxScale) scale += scaleDelta
      else if (delta < 0 && scale >= this.options.minScale + scaleDelta) scale -= scaleDelta

      if (scale < this.options.minScale + scaleDelta) this.reset()
      else {
        this.state.zooming = true
        this.state.scale = scale
        this.zoomOnMouse(e, scale)
      }
    }
  }

  onTouchStart(e) {
    e.preventDefault()
    if (this.options.zoomOnPinch) {
      this.state.panning = false
      if (e.touches.length === 1 && this.state.zooming) {
        this.state.panning = true
        this.state.start.x = e.touches[0].pageX
        this.state.start.y = e.touches[0].pageY
      }
      if (e.touches.length === 2) {
        this.state.start.x = Math.abs(e.touches[0].pageX - e.touches[1].pageX) / 2
        this.state.start.y = Math.abs(e.touches[0].pageY - e.touches[1].pageY) / 2
        this.state.start.distance = this.distance(e)
        this.state.zooming = true
      }
    }
  }

  onTouchMove(e) {
    e.preventDefault()
    if (this.options.zoomOnPinch) {
      if (e.touches.length === 2) {
        if (this.state.last.distance === 0) this.state.last.distance = this.distance(e)
        const deltaD = (this.state.last.distance - this.state.start.distance) / this.state.start.distance

        const x1 = e.touches[0].pageX
        const y1 = e.touches[0].pageY
        const x2 = e.touches[1].pageX
        const y2 = e.touches[1].pageY

        const deltaX = Math.abs(x1 - x2) / 2 + Math.min(x1, x2)
        const deltaY = Math.abs(y1 - y2) / 2 + Math.min(y1, y2)
        if (deltaD < 0) {
          this.state.scale = Math.max(this.state.scale + deltaD, 1)
        } else this.state.scale = Math.min(this.state.scale + deltaD, props.maxScale)
        this.state.pointX = -(deltaX * (this.state.scale - 1))
        this.state.pointY = -(deltaY * (this.state.scale - 1))
        this.state.zooming = true

        this.state.start.distance = this.state.last.distance
        this.state.last.distance = this.distance(e)
      }
      if (e.touches.length === 1 && this.state.panning && this.state.zooming) {
        const deltaX = this.state.start.x - this.state.last.x
        const deltaY = this.state.start.y - this.state.last.y
        this.state.pointX -= deltaX * this.state.scale
        this.state.pointY -= deltaY * this.state.scale

        this.state.start.x = this.state.last.x
        this.state.start.y = this.state.last.y
        this.state.last.x = e.touches[0].pageX
        this.state.last.y = e.touches[0].pageY
      }
    }
  }

  onTouchEnd(e) {
    this.state.last.distance = 0
  }

  onDoubleClick(e) {
    e.preventDefault()
    if (this.options.zoomOnDoubleClick) {
      if (this.state.zooming) this.reset()
      else {
        this.state.zooming = true
        this.zoomOnMouse(e)
      }
    }
  }
}

customElements.define('image-zoom', ImageZoom, { extends: 'img' })
