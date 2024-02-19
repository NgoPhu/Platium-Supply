import { getAttribute } from 'helpers/dom'
import { Fragment } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import useClickOutSide from 'uses/useClickOutSide'
import Icon from 'snippets/icon/icon'

function PlpSort({ sortOptions, sortOrder, isMobile, applySort }) {
  const getCurrentSort = (orders) => (orders ? sortOptions.find((item) => orders.direction === item.direction) : null)
  const [isActive, setIsActive] = useState(false)
  const [localSort, setLocalSort] = useState(getCurrentSort(sortOrder))
  const refSortEl = useRef(null)

  const handleClickOutSide = () => {
    setIsActive(false)
  }

  useEffect(() => {
    if (!localSort) {
      setLocalSort(sortOptions[1])
    }
  }, [])

  useClickOutSide(refSortEl, handleClickOutSide)

  return (
    <div className="relative flex items-center" ref={refSortEl}>
      <div className="mr-1 text-sm tracking-normal text-grey-900 lg-max:hidden">Sort by:</div>
      <div className="flex items-center justify-center text-sm font-semibold font-body tracking-normal text-grey-900 lg:hidden">
        Sort by
        <Icon viewBox="0 0 17 16" name="icon-chevron-down-outline-3" className='w-4 h-4 ml-2 text-secondary' />
      </div>
      {isMobile ? (
        <PlpSortSelect options={sortOptions} sortOrder={sortOrder} localSort={localSort} setLocalSort={setLocalSort} applySort={applySort} />
      ) : (
        <PlpSortDropdown
          options={sortOptions}
          sortOrder={sortOrder}
          localSort={localSort}
          setLocalSort={setLocalSort}
          applySort={applySort}
          isActive={isActive}
          setIsActive={setIsActive}
        />
      )}
    </div>
  )
}

function PlpSortDropdown({ options, localSort, setLocalSort, applySort, isActive, setIsActive }) {
  const handleActive = () => {
    setIsActive(!isActive)
  }

  const handleChange = (e) => {
    const name = getAttribute('data-value', e.target)
    const current = options.find((item) => item.label === name)
    setLocalSort(current)
    applySort(current)
  }

  return (
    <Fragment>
      <button className="flex items-center text-sm tracking-normal" onClick={() => handleActive()}>
        <span className="text-secondary">{localSort && localSort.label}</span>
        <span className="text-grey-500">
          {!isActive && <Icon viewBox="0 0 20 20" name="icon-chevron-down-outline-2" className='w-4 h-4' />}
          {isActive && <Icon viewBox="0 0 20 20" name="icon-chevron-up-outline" className='w-4 h-4' />}
        </span>
      </button>
      <div className={`absolute top-[38px] left-0 z-30 w-[140px] border border-default bg-white px-3 py-2 ${isActive ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {options.map((item) => (
          <div
            className={`cursor-pointer py-1 text-xs hover:underline ${item.active ? 'underline' : ''}`}
            data-value={item.label}
            key={item.label}
            onClick={handleChange}
          >
            {item.label}
          </div>
        ))}
      </div>
    </Fragment>
  )
}

function PlpSortSelect({ options, localSort, setLocalSort, applySort }) {
  const handleChange = (e) => {
    const current = options.find((item) => item.label === e.target.value)
    setLocalSort(current)
    applySort(current)
  }
  return (
    <Fragment>
      <select
        className="absolute top-0 right-0 p-0 text-sm font-semibold tracking-normal border-0 opacity-0 appearance-none text-grey-900 bg-none font-body"
        onChange={handleChange}
      >
        {options.map((item) => (
          <option value={item.label} key={item.label} selected={(item?.direction && item?.direction === localSort?.direction) || item.active}>
            {item.label}
          </option>
        ))}
      </select>
    </Fragment>
  )
}

export default PlpSort
