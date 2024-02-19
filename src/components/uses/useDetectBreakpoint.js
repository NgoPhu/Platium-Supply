import { on } from 'helpers/dom'
import { useState, useEffect } from 'preact/hooks'
import { detectBreakpoint } from 'helpers/global'
import throttle from 'lodash.throttle'

function useDetectBreakpoint() {
  const [isMobile, setIsMobile] = useState(detectBreakpoint(''))
  const [isTablet, setIsTablet] = useState(detectBreakpoint('tablet'))
  const [isDesktop, setIsDesktop] = useState(detectBreakpoint('desktop'))

  const onResize = () => {
    const currentWidth = window.innerWidth
    setIsMobile(detectBreakpoint('', currentWidth))
    setIsTablet(detectBreakpoint('tablet', currentWidth))
    setIsDesktop(detectBreakpoint('desktop', currentWidth))
  }

  useEffect(() => {
    on(
      'resize',
      throttle(() => onResize(), 500),
      window
    )
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop
  }
}

export default useDetectBreakpoint
