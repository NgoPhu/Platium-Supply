import { useEffect } from 'preact/hooks'
import { on, off } from 'helpers/dom'

function useClickOutSide(ref, callback = null) {
  const onHandle = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      if (callback) {
        callback()
      } else {
        console.log('click out side', e.target)
      }
    }
  }
  useEffect(() => {
    on(
      'mousedown',
      (e) => {
        onHandle(e)
      },
      document
    )
    return () => {
      off(
        'mousedown',
        (e) => {
          onHandle(e)
        },
        document
      )
    }
  }, [])
}

export default useClickOutSide
