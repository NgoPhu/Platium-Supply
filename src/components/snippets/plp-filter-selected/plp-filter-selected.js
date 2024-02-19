import { useMemo } from 'preact/hooks'
import Icon from 'snippets/icon/icon'
import { formatName, formatRangePrice } from 'helpers/utils'
import { getSelectedValues } from 'uses/useSearchspringUtils'

const selectors = {
  priceKey: 'filter.v.price'
}

function PlpFilterSelected({ selectedValues, applyFilters, filters }) {
  const values = useMemo(() => getSelectedValues(selectedValues, selectors.priceKey), [selectedValues])

  const handleRemove = (item) => {
    const currentSelectedValues = getCurrentSelectedValues(item)
    applyFilters({
      selectedValues: currentSelectedValues,
      page: 1
    })
  }

  const getCurrentSelectedValues = (item) => {
    const selected = selectedValues
    if (item) {
      if (item.key !== selectors.priceKey) {
        const target = selected[item.key]
        selected[item.key] = target.filter((i) => i !== item.value)
      } else {
        delete selected[item.key]
      }
    }
    return selected
  }

  const onClears = () => {
    applyFilters({
      selectedValues: {},
      page: 1,
      type: 'init'
    })
  }

  const translate = window.plpState.translates

  const getFilterName = (key) => {
    const filter = filters.find(filter => filter.field === key)
    return filter?.label
  }

  return (values && values.length ? (
    <div className="lg:pb-5 lg:border-b lg:border-default lg:mb-5">
      <div className="flex items-start justify-between w-full">
        <p className="text-base font-bold text-grey-900">Filtering by:</p>
        <button type="button" className="text-sm font-normal underline link text-grey-600" onClick={() => onClears()}>
          {translate.clearSelections}
        </button>
      </div>
      <div className="flex flex-wrap items-center">
        {values.map((item) => (
          <button
            type="button"
            className="flex items-center px-4 py-0.5 min-h-[28px] mt-3 mr-3 transition duration-300 ease-in-out bg-grey-100 rounded-[99px]"
            onClick={() => handleRemove(item)}
          >
            <span className="flex-1 block mr-2 font-sans font-medium text-med text-grey-900">{getFilterName(item.key)}: {item.key === selectors.priceKey ? formatRangePrice(item.value) : item.value}</span>
            <div className="w-5 h-full flex-center">
              <Icon name="icon-close" viewBox="0 0 12 12" className="w-3 h-3 text-primary" />
            </div>
          </button>
        ))}
      </div>
    </div>
  ) : (
    ''
  ))
}

export default PlpFilterSelected
