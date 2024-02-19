/* global globalEvents */
import { useEffect, useMemo, useState } from 'preact/hooks'
import Image from 'snippets/image/image'
import { eventProps } from 'helpers/global'
import { Fragment } from 'preact'
import { hasOwnProperties } from 'helpers/utils'

const colourKeys = ['Colour', 'Color']

function ProductVariant({ variants, options, updateCurrentVariant, initVariant, updateUrl, displayType, isModal = false }) {
  const [selected, setSelected] = useState({})
  const [selectableValues, setSelectableValues] = useState({})

  const getSelectableValues = (a, b) => {
    const values = Object.assign({}, a)
    const selectedOptions = Object.keys(b)
    if (!selectedOptions.length) {
      return values
    }
    for (const selectedOption of selectedOptions) {
      const selectedValue = b[selectedOption]
      const otherOptions = options.filter((option) => option !== selectedOption)
      if (otherOptions.length) {
        for (const otherOption of otherOptions) {
          values[otherOption] = values[otherOption].filter((value) => {
            return variants.some((variant) => variant.options.indexOf(value) !== -1 && variant.options.indexOf(selectedValue) !== -1 && variant.available)
          })
        }
      } else {
        values[selectedOption] = values[selectedOption].filter((value) => {
          if (options.length > 1) {
            return variants.some((variant) => variant.options.indexOf(value) !== -1 && variant.options.indexOf(selectedValue) !== -1 && variant.available)
          } else {
            return variants.some((variant) => variant.options.indexOf(selectedValue) !== -1 && variant.available)
          }
        })
      }
    }
    return values
  }

  const getSelectedVariant = (selectedValues) => {
    const matched = variants.filter((variant) => {
      const matchedOptions = []
      for (const option in selectedValues) {
        matchedOptions.push(variant.options.includes(selectedValues[option]))
      }
      return matchedOptions.reduce((result, item) => result && item, [])
    })

    return matched[0]
  }

  const getInitalSelected = (currentVariant) => {
    const values = {}
    for (const index in options) {
      const option = options[index]

      if (!values[option]) {
        values[option] = []
      }

      const value = currentVariant.options[index]
      if (!values[option].includes(value)) {
        values[option] = value
      }
    }

    return values
  }

  const setUrlParams = (variant) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (!urlParams.has('variant')) {
      urlParams.append('variant', variant.id)
    } else {
      urlParams.set('variant', variant.id)
    }
    window.history.replaceState({}, null, `${window.location.pathname}?${urlParams.toString()}`)
  }

  useEffect(() => {
    const selectedInit = getInitalSelected(initVariant)
    setSelected(selectedInit)
  }, [])

  const availableValues = useMemo(() => {
    const values = {}
    for (const index in options) {
      const option = options[index]

      if (!values[option]) {
        values[option] = []
      }

      for (const variant of variants) {
        const value = variant.options[index]
        if (!values[option].includes(value)) {
          values[option].push(value)
        }
      }
    }
    return values
  }, [])

  const variantImagesByColor = useMemo(() => {
    const colors = availableValues.Color || availableValues.Colour
    if (colors && colors.length) {
      return colors.map(color => {
        const matchedVariant = variants.find(variant => variant.options.indexOf(color) !== -1 && variant.featured_image)
        return {
          src: matchedVariant ? matchedVariant.featured_image.src : this.featuredImage,
          color
        }
      })
    }
    return []
  }, [])

  const getVariantImage = (color) => {
    const image = variantImagesByColor.find(image => image.color === color)
    return image && image.src
  }

  useMemo(() => {
    const values = getSelectableValues(availableValues, selected)
    setSelectableValues(values)
  }, [availableValues, selected])

  const selectedVariant = useMemo(() => getSelectedVariant(selected), [selected])

  const isOnlyVariantDefault = useMemo(() => {
    return variants.length === 1 && variants[0].title === 'Default Title'
  }, [])

  useEffect(() => {
    if (selectedVariant) {
      updateCurrentVariant(selectedVariant)
      if (updateUrl) {
        setUrlParams(selectedVariant)
      }
      globalEvents.emit(eventProps.product.updateVariant, selectedVariant)
    }
  }, [selected])

  return (
    <div className="flex flex-col text-sm">
      {!isOnlyVariantDefault &&
        Object.entries(availableValues).map(([key, values], index) => (
          <VariantGroup
            key={index}
            name={key}
            values={values}
            selected={selected}
            selectableValues={selectableValues}
            setSelected={setSelected}
            displayType={displayType}
            isModal={isModal}
            getVariantImage={getVariantImage}
          />
        ))}
    </div>
  )
}

function VariantGroup({ name, values, selected, selectableValues, setSelected, displayType, isModal, getVariantImage }) {
  return (
    <div className={`mt-5 ${colourKeys.includes(name) ? 'order-first' : ''}`}>
      {displayType === 'dropdown' ? (
        <VariantDropdown items={values} option={name} selected={selected} selectableValues={selectableValues} setSelected={setSelected} />
      ) : (
        <Fragment>
          <div>
            <span className="mr-1 text-sm font-bold">Choose {name}:</span>
            {hasOwnProperties(name, selected) && selected[name] && <span className="text-grey-900">{selected[name]}</span>}
          </div>
          <VariantList items={values} option={name} selected={selected} selectableValues={selectableValues} setSelected={setSelected} isModal={isModal} getVariantImage={getVariantImage} />
        </Fragment>
      )}
    </div>
  )
}

function VariantItem({ value, option, selected, selectableValues, setSelected, isModal, getVariantImage }) {
  const onSelect = (value, option) => {
    selected = { ...selected, [option]: value }
    setSelected(selected)
  }

  const isSelected = hasOwnProperties(option, selected) && selected[option] === value

  const isDisabled = hasOwnProperties(option, selectableValues) && !selectableValues[option].includes(value)

  const isColour = colourKeys.includes(option)

  const getSwatchClass = (name) => {
    return `colour-swatch-${name.toLowerCase()}`
  }

  return (
    <Fragment>
      {!isColour ? (
        <button
          type="button"
          className={`rounded-lg border border-custom h-10 px-5 text-center text-grey-900 lg-max:min-w-[76px] ${isSelected && 'text-secondary font-bold border-secondary bg-success-bg'}`}
          name={value}
          onClick={() => onSelect(value, option)}
        >
          {value}
        </button>
      ) : (
        <div className={`w-20 h-20 p-2 cursor-pointer border border-custom rounded-[10px] ${isSelected && 'border-secondary'}`} onClick={() => onSelect(value, option)}>
          <Image
            imageUrl={[getVariantImage(value)]}
            imageClass="w-full h-full"
            imageBreakpoints="(min-width: 768px)|(min-width: 0px)"
            isCover={false}
            isLazy={true}
          />
        </div>
      )}
    </Fragment>
  )
}

function VariantList({ items, option, selected, selectableValues, setSelected, isModal, getVariantImage }) {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      {items.length &&
        items.map((item) => (
          <VariantItem value={item} option={option} selected={selected} selectableValues={selectableValues} setSelected={setSelected} isModal={isModal} getVariantImage={getVariantImage} />
        ))}
    </div>
  )
}

function VariantDropdown({ items, option, selected, selectableValues, setSelected }) {
  const onChange = (e) => {
    selected = { ...selected, [option]: e.target.value }
    setSelected(selected)
  }

  return (
    items.length && (
      <select onChange={onChange} className="input !pt-3.5 !pb-2.5">
        {items.map((item) => (
          <option value={item} selected={selected[option] === item}>
            {item}
          </option>
        ))}
      </select>
    )
  )
}

export default ProductVariant
