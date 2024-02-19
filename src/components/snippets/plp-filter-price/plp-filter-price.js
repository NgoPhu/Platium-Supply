import { useEffect, useState } from 'preact/hooks'
import RadioInput from 'snippets/radio-input/radio-input'

function PlpFilterPrice({ isMobile, field, localSelected, selectedValues, applyFilters, onClick }) {
  const [selectedGroup, setSelectedGroup] = useState(selectedValues[field.field] || [])
  const createSubArrays = (start, end, step) => {
    const result = []

    for (let i = start; i < end; i += step) {
      if (i + step > end) {
        result.push([i, end])
      } else {
        result.push([i, i + step])
      }
    }

    return result
  }

  const [min, max] = field.range
  const step = 30
  const [values, setValues] = useState(createSubArrays(min, max, step))

  const setSelectedItem = (value) => {
    if (isMobile) {
      setSelectedGroup(value)
    } else {
      onClick()
      applyFilters({
        selectedValues: { ...selectedValues, [field.field]: value },
        page: 1
      })
    }
  }

  useEffect(() => {
    localSelected(field.field, selectedGroup)
  }, [selectedGroup])

  const getLabel = (item) => {
    return `${item[0] > 0 ? '$' : ''}${item[0]} - $${item[1]}`
  }

  return (
    values.map((item, index) => (
      <RadioInput
        key={index}
        value={item}
        label={getLabel(item)}
        checked={JSON.stringify(selectedGroup).includes(JSON.stringify(item))}
        index={index}
        formatLabel={false}
        onSelected={setSelectedItem}
      />
    ))
  )
}

export default PlpFilterPrice
