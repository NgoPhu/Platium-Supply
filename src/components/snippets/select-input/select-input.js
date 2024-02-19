import { useState } from 'preact/hooks'
import Icon from '../icon/icon'

function SelectInput({ id, label, name, items, required, value, autocomplete, customClass = '', wrapClass = '', onChange }) {
  const [selectedValue, setSelectedValue] = useState(value || '')

  const onChangeValue = (e) => {
    const currentValue = e.target.value
    setSelectedValue(currentValue)
    if (typeof onChange === 'function') {
      onChange(currentValue)
    }
  }
  return (
    items &&
    items.length > 0 && (
      <div>
        <div className={`relative ${wrapClass}`}>
          <select
            id={id}
            name={name}
            className={`input peer ${customClass}`}
            autocomplete={autocomplete}
            value={value}
            required={required}
            onChange={onChangeValue}
          >
            {items.map((item) => (
              <option selected={selectedValue === item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </select>
          {label && (
            <label className="input-label" for={id}>
              {label}
              {required && '*'}
            </label>
          )}
        </div>
      </div>
    )
  )
}

export default SelectInput
