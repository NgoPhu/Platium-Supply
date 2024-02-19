import { useState, useEffect } from 'preact/hooks'

function CheckboxInput({ value, label, checked, index, count, onSelected, classWrap = '', classInput = '' }) {
  const [isChecked, setIsChecked] = useState(checked)
  const handleSelected = (value) => {
    setIsChecked(!isChecked)
    onSelected(value, !isChecked)
  }

  return (
    <div key={value} className={`checkbox-input relative mt-4 flex items-center ${classWrap}`}>
      <input
        id={`${value}-${index}`}
        className={`checkbox-input__input ${classInput}`}
        type="checkbox"
        value={value}
        checked={isChecked}
        onInput={() => handleSelected(value)}
      />
      <label for={`${value}-${index}`} className="flex justify-between flex-1 checkbox-input__label text-grey-900">
        {label}
        {count ? <span className="font-sans text-sm text-grey-500">({count})</span> : ''}
      </label>
    </div>
  )
}

export default CheckboxInput
