import { useState, useEffect } from 'preact/hooks'
import { handleize } from 'helpers/dom'
import CheckboxInput from 'snippets/checkbox-input/checkbox-input'
import RadioInput from 'snippets/radio-input/radio-input'

const { searchSpringConfig } = window.GM_STATE.integrations

function PlpFilterItems({ isMobile, field, selectedValues, localSelected, applyFilters, onClick }) {
  const [selectedGroup, setSelectedGroup] = useState(selectedValues[field.field] || [])
  const type = field.multiple !== 'multiple-intersect' ? 'radio' : 'checkbox'

  const collectionFilters = () => {
    const collectionFilters = searchSpringConfig.collectionFilters ? searchSpringConfig.collectionFilters.split('|') : []
    const collectionFieldValue = field.values

    return collectionFieldValue.filter((value) => collectionFilters.includes(handleize(value.value)))
  }

  const fieldValues = field.field === 'collection_name' && collectionFilters().length > 0 ? collectionFilters() : field.values

  const setSelectedItem = (value, checked) => {
    let values = []
    if (type === 'radio') {
      values = typeof value !== 'string' ? value : [value]
    } else {
      if (checked) {
        values = [...selectedGroup, value]
      } else {
        values = selectedGroup.filter((item) => item !== value)
      }
    }
    if (isMobile) {
      setSelectedGroup(values)
    } else {
      onClick()
      applyFilters({
        selectedValues: { ...selectedValues, [field.field]: values },
        page: 1
      })
    }
  }

  useEffect(() => {
    localSelected(field.field, selectedGroup)
  }, [selectedGroup])

  return fieldValues.map((item, index) =>
    type === 'checkbox' ? (
      <CheckboxInput
        key={item.value}
        value={item.value}
        checked={selectedGroup.includes(item.value)}
        label={item.label}
        index={index}
        count={item?.count}
        onSelected={setSelectedItem}
      />
    ) : (
      <RadioInput
        key={item.value}
        value={item.value}
        checked={item.value ? selectedGroup.includes(item.value) : JSON.stringify(selectedGroup) === JSON.stringify([item.low, item.high])}
        label={item.label}
        index={index}
        onSelected={setSelectedItem}
        type={item.type}
        range={[Number(item.low) || 0, Number(item.high) || 0]}
      />
    )
  )
}

export default PlpFilterItems
