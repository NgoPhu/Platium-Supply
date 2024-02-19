function RadioInput({ value, label, checked, index, onSelected, type, range }) {
  const handleSelect = () => {
    if (type === 'range') {
      onSelected(range)
    } else {
      onSelected(value)
    }
  }

  return (
    <div key={value} className="checkbox-input relative mb-4 flex items-center">
      <input id={`${value}-${index}`} className="radio-input__input" type="radio" name={name} value={value} checked={checked} onInput={handleSelect} />
      <label for={`${value}-${index}`} className="radio-input__label">
        {label}
      </label>
    </div>
  )
}

export default RadioInput
