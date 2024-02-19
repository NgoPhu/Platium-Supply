import { loadScript, select, on, selectAll, addClass } from 'helpers/dom'

const selectors = {
  VIDEO_PLAYER_SELECTOR: 'video-player',
  VIDEO_THUMBNAIL_SELECTOR: 'video-thumbnail',
  PLAYING_CLASS: 'is-playing',
  VIDEO_THUMBNAIL: '.js-thumbnail'
}
export default class VideoPlayer extends HTMLElement {
  constructor() {
    super()

    this.player = null
    this.status = {
      play: false,
      error: null
    }

    this.elementInsert = document.createElement('div')
    this.playIntersection = this.hasAttribute('data-play-intersection')

    this.settings = {
      type: this.getAttribute('data-video-type').toLowerCase() || 'mp4',
      src: this.getAttribute('src')
    }

    this.options = {
      autoplay: this.hasAttribute('autoplay'),
      controls: this.hasAttribute('controls'),
      playsinline: this.hasAttribute('playsinline'),
      muted: this.hasAttribute('muted'),
      loop: this.hasAttribute('loop'),
      origin: window.location.origin
    }

    if (this.settings.type === 'youtube') this.appendChild(this.elementInsert)

    this.videos = [...selectAll(selectors.VIDEO_PLAYER_SELECTOR), ...selectAll(selectors.VIDEO_THUMBNAIL_SELECTOR)]
  }

  connectedCallback() {
    this.load()
  }

  async load () {
    if (this.settings.type !== 'mp4') {
      await this.loadAPI()

      if (this.settings.type === 'youtube') YT.ready(() => this.setupYTPlayer())
      else if (this.settings.type === 'vimeo') this.setupVimeoPlayer()
    } else {
      this.videoEl = document.createElement('video')
      this.videoEl.src = this.settings.src
      this.player = this.videoEl
      this.appendChild(this.videoEl)
      this.setupMP4Player()
    }

    if (this.playIntersection) this.onInterSection()
  }

  get videoId() {
    if (this.getAttribute('data-external-id')) return this.getAttribute('data-external-id')
    if (/youtu\.?be/.test(this.settings.src)) {
      const patterns = [
        /youtu\.be\/([^#&?]{11})/, // youtu.be/<id>
        /\?v=([^#&?]{11})/, // ?v=<id>
        /&v=([^#&?]{11})/, // &v=<id>
        /embed\/([^#&?]{11})/, // embed/<id>
        /\/v\/([^#&?]{11})/ // /v/<id>
      ]

      for (let i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(this.settings.src)) {
          return patterns[i].exec(this.settings.src)[1]
        }
      }
    }

    if (/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.test(this.settings.src)) {
      const parseURL = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.exec(this.settings.src)
      return parseURL[5]
    }
    return null
  }

  loadAPI() {
    let src = ''

    if (this.settings.type === 'youtube' && !window.YT) {
      src = 'https://www.youtube.com/iframe_api'
    } else if (this.settings.type === 'vimeo' && !window.Vimeo) {
      src = 'https://player.vimeo.com/api/player.js'
    }
    return loadScript(src)
  }

  setupYTPlayer() {
    const options = {
      videoId: this.videoId,
      playerVars: {
        autoplay: this.options.autoplay ? 1 : 0,
        controls: this.options.controls ? 1 : 0,
        height: '100%',
        width: '100%',
        playsinline: this.options.playsinline ? 1 : 0,
        loop: this.options.loop ? 1 : 0
      },
      events: {
        onError: () => {
          this.status.error = new Error('player could not be built')
        },
        onStateChange: (e) => this._onYouTubeStateChange(e),
        onReady: (e) => this._onYoutubeReadyState(e)
      }
    }
    if (YT.loaded) {
      this.player = new window.YT.Player(this.elementInsert, options)
    }
  }

  setupVimeoPlayer() {
    const options = {
      id: this.videoId,
      ...this.options
    }

    this.player = new window.Vimeo.Player(this, options)
    this.player.on('play', () => this.onPlay())
    this.player.on('pause', () => this.onPause())
    this.player.on('ended', () => this.onEnd)
  }

  setupMP4Player() {
    this.player.controls = this.options.controls
    this.player.autoplay = this.options.autoplay
    this.player.playsInline = this.options.playsinline
    this.player.muted = this.options.muted
    this.player.loop = this.options.loop

    this.player.addEventListener('play', () => this.onPlay())
    this.player.addEventListener('pause', () => this.onPause())
    this.player.addEventListener('ended', () => this.onEnd())
  }

  play() {
    try {
      if (!this.settings.src) {
        this.status.error = 'No video src'
        return
      }

      if (this.player) {
        if (this.settings.type === 'youtube') this.player.playVideo()
        else this.player.play()
      }
    } catch (error) {
      this.status.error = error
    }
  }

  pause() {
    try {
      if (this.player) {
        if (this.settings.type === 'youtube') this.player.pauseVideo()
        else {
          this.player.pause()
        }
      }
    } catch (error) {
      this.status.error = error
    }
  }

  onPlay() {
    this.videos.forEach(video => {
      if (video !== this && video.status.play && video.hasAttribute('single-play')) {
        video.pause()
      }
    })

    this.observeVisibility(this).then((isVisible) => {
      if (isVisible) {
        this.play()
        this.status.play = true
        this.dispatchEvent(new CustomEvent('play'))
        this.classList.add(selectors.PLAYING_CLASS)
      }
    })
  }

  onPause() {
    this.status.play = false
    this.dispatchEvent(new CustomEvent('pause'))
    this.classList.remove(selectors.PLAYING_CLASS)
  }

  onEnd() {
    this.status.play = false
    this.dispatchEvent(new CustomEvent('ended'))
    this.classList.remove(selectors.PLAYING_CLASS)
    if (this.options.loop) {
      this.play()
    }
  }

  onInterSection () {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8
    }

    const callback = (entries) => {
      entries.forEach(entry => {
        if (this.player) {
          if (!entry.isIntersecting) {
            this.pause()
          } else if (entry.isIntersecting) this.play()
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)

    observer.observe(this)
  }

  _onYouTubeStateChange(e) {
    const stateMap = {
      '-1': 'unstarted',
      0: 'ended',
      1: 'playing',
      2: 'pause',
      3: 'buffering',
      5: 'cued'
    }
    const state = stateMap[e.data.toString()]
    const eventMethodMap = {
      ended: this.onEnd,
      pause: this.onPause,
      playing: this.onPlay
    }
    if (eventMethodMap[state]) {
      const method = eventMethodMap[state]
      if (method) {
        method.call(this)
      }
    }
  }

  _onYoutubeReadyState(e) {
    if (this.options.autoplay) {
      this.player.mute()
      this.player.playVideo()
    }
    if (this.options.muted) {
      this.player.mute()
    }
  }

  observeVisibility(element) {
    return new Promise(resolve => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting && getComputedStyle(element).display !== 'none'
          resolve(isVisible)
        })
      })

      observer.observe(element)
    })
  }
}

customElements.define('video-player', VideoPlayer)

class VideoThumbnail extends VideoPlayer {
  constructor () {
    super()

    this.thumbnail = select(selectors.VIDEO_THUMBNAIL, this)

    this.onClickPlay()
  }

  onClickPlay() {
    this.thumbnail && on('click', () => {
      this.play()
      addClass(selectors.PLAYING_CLASS, this.thumbnail)
      this.hideThumbnail()
    }, this.thumbnail)
  }

  onPlay() {
    super.onPlay()

    this.hideThumbnail()
  }

  hideThumbnail() {
    this.thumbnail && (this.thumbnail.style.display = 'none')
  }
}

customElements.define('video-thumbnail', VideoThumbnail)
