import { formatMoney } from 'uses/useShopify'
import { Fragment } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { hasOwnProperties } from 'helpers/utils'
import MultiRangeSlider from 'snippets/multi-range-slider/multi-range-slider'

function PlpFilterSlider({ isMobile, field, localSelected, selectedValues, applyFilters }) {
  const [min, max] = field.range
  const step = field.step
  const [leftValue, setLeftValue] = useState(selectedValues[field.field] ? selectedValues[field.field][0] : min)
  const [rightValue, setRightValue] = useState(selectedValues[field.field] ? selectedValues[field.field][1] : max)
  const state = { setLeftValue, setRightValue }

  const applyFilterRange = (values) => {
    applyFilters({
      selectedValues: {
        ...selectedValues,
        [field.field]: values
      }
    })
  }

  useEffect(() => {
    if (isMobile) {
      localSelected(field.field, [leftValue, rightValue])
    } else {
      if (
        (!hasOwnProperties(field.field, selectedValues) && (leftValue !== min || rightValue !== max)) ||
        (hasOwnProperties(field.field, selectedValues) && JSON.stringify(selectedValues[field.field]) !== JSON.stringify([leftValue, rightValue]))
      ) {
        applyFilterRange([leftValue, rightValue])
      }
    }
  }, [leftValue, rightValue])

  return (
    <Fragment>
      <MultiRangeSlider min={min} max={max} step={step} currentLeft={leftValue} currentRight={rightValue} state={state}></MultiRangeSlider>
      <div className="flex justify-between">
        <span className="text-sm">{formatMoney(min * 100)}</span>
        <span className="text-sm">{formatMoney(max * 100)}</span>
      </div>
    </Fragment>
  )
}

export default PlpFilterSlider
