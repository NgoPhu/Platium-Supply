import { useState, useMemo, useRef } from 'preact/hooks'
import { Fragment } from 'preact'
import useClickOutSide from 'uses/useClickOutSide'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'

function CustomSelector({ id = 'custom-selector', value = '', label, options, onChange, className, classInput, classLabel }) {
  const { isMobile } = useDetectBreakpoint()
  const [isActive, setIsActive] = useState(false)
  const name = useMemo(() => {
    const optionSelected = options.filter((option) => option.value === value)
    return optionSelected.length ? optionSelected[0].name : 'Select option'
  }, [value])
  const refSelector = useRef(null)

  const changeValue = (e) => {
    const value = e.target.value
    onChange(value)
  }

  const changeValueDesktop = (value) => {
    onChange(value)
    setIsActive(false)
  }

  const handleClickOutSide = () => {
    setIsActive(false)
  }
  useClickOutSide(refSelector, handleClickOutSide)

  return (
    <div ref={refSelector} className="relative">
      {isMobile ? (
        <Fragment>
          <select id={id} className={`input peer ${classInput}`} onChange={changeValue}>
            {options.map((option) => (
              <option value={option.value} selected={option.value === value}>
                {option.name}
              </option>
            ))}
          </select>
          <label className={`input-label ${classLabel}`} for={id}>
            {label}
          </label>
        </Fragment>
      ) : (
        <Fragment>
          <button className={`relative text-left ${className}`} onClick={() => setIsActive(!isActive)}>
            <span className={`input-label ${classLabel}`}>{label}</span>
            <span className={`input ${classInput}`}>{name}</span>
            <svg
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-grey-500 transition duration-300 ${isActive && 'rotate-180'}`}
            >
              <path
                id="icon-chevron-down-outline-2"
                d="m5.25 8.625 6.75 6.75 6.75-6.75"
                stroke="gray"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          {isActive && (
            <div className="absolute left-0 z-20 w-full border border-default bg-white px-3 py-2">
              {options.map((option) => (
                <div
                  className={`cursor-pointer py-1 text-sm hover:underline ${option.value === value ? 'underline' : ''}`}
                  onClick={() => changeValueDesktop(option.value)}
                >
                  {option.name}
                </div>
              ))}
            </div>
          )}
        </Fragment>
      )}
    </div>
  )
}

export default CustomSelector
