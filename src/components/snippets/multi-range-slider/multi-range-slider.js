import { useEffect, useRef, useState } from 'preact/hooks'
import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'

const selectors = {
  throttleTime: 50,
  debounceTime: 300
}

function MultiRangeSlider({ min, max, step, currentLeft, currentRight, state }) {
  const inverseLeftRef = useRef()
  const inverseRightRef = useRef()
  const rangeRef = useRef()
  const thumbLeftRef = useRef()
  const thumbRightRef = useRef()
  const leftRef = useRef()
  const rightRef = useRef()

  const [leftValue, setLeftValue] = useState(currentLeft)
  const [rightValue, setRightValue] = useState(currentRight)

  const getPercent = (value) => {
    return (100 / (parseInt(max) - parseInt(min))) * parseInt(value) - (100 / (parseInt(max) - parseInt(min))) * parseInt(min)
  }

  useEffect(() => {
    state.setLeftValue(leftValue)
  }, [leftValue])

  useEffect(() => {
    state.setRightValue(rightValue)
  }, [rightValue])

  const onInputLeft = (e) => {
    onChangeLeft(e)
    onChangeValueLeft(e)
  }

  const onInputRight = (e) => {
    onChangeRight(e)
    onChangeValueRight(e)
  }

  const onChangeLeft = throttle((e) => {
    let value = e.target.value
    value = Math.min(value, rightRef.current.value - step)
    const percent = getPercent(value)

    inverseLeftRef.current.style.width = percent + '%'
    rangeRef.current.style.left = percent + '%'
    thumbLeftRef.current.style.left = percent + '%'
  }, selectors.throttleTime)

  const onChangeRight = throttle((e) => {
    let value = e.target.value
    value = Math.max(value, leftRef.current.value - -step)
    const percent = getPercent(value)

    inverseRightRef.current.style.width = 100 - percent + '%'
    rangeRef.current.style.right = 100 - percent + '%'
    thumbRightRef.current.style.left = percent + '%'
  }, selectors.throttleTime)

  const onChangeValueLeft = debounce((e) => {
    const value = e.target.value
    setLeftValue(parseInt(value))
  }, selectors.debounceTime)

  const onChangeValueRight = debounce((e) => {
    const value = e.target.value
    setRightValue(parseInt(value))
  }, selectors.debounceTime)

  return (
    <div className="relative mb-2 h-4">
      <div className="absolute left-0 right-1">
        <div ref={inverseLeftRef} className="absolute top-1.5 left-0 h-1 bg-grey-400" style={`width:${getPercent(currentLeft)}%;`}></div>
        <div ref={inverseRightRef} className="absolute top-1.5 right-0 h-1 bg-grey-400" style={`width:${100 - getPercent(currentRight)}%;`}></div>
        <div
          ref={rangeRef}
          className="absolute top-1.5 left-0 h-1 bg-black"
          style={`left:${getPercent(currentLeft)}%;right:${100 - getPercent(currentRight)}%;`}
        ></div>
        <span ref={thumbLeftRef} className="absolute block h-4 w-1 bg-primary" style={`left:${getPercent(currentLeft)}%;`}></span>
        <span ref={thumbRightRef} className="absolute block h-4 w-1 bg-primary" style={`left:${getPercent(currentRight)}%;`}></span>
      </div>
      <input
        ref={leftRef}
        className="pointer-events-none absolute top-1.5 z-30 h-1 w-full cursor-pointer opacity-0"
        type="range"
        value={leftValue}
        max={max}
        min={min}
        step="1"
        onInput={(e) => onInputLeft(e)}
        aria-label="left"
      />
      <input
        ref={rightRef}
        className="pointer-events-none absolute top-1.5 z-30 h-1 w-full cursor-pointer opacity-0"
        type="range"
        value={rightValue}
        max={max}
        min={min}
        step="1"
        oninput={(e) => onInputRight(e)}
        aria-label="right"
      />
    </div>
  )
}

export default MultiRangeSlider
