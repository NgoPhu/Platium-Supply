import { useState, useEffect } from 'preact/hooks'
import AccordionItem from 'snippets/accordion-item/accordion-item'
import PlpFilterGroup from 'snippets/plp-filter-group/plp-filter-group'

function PlpFilterPanel({ className, isMobile, filters, selectedValues, localSelectedValues, isSlideout = false, applyFilters, onClick }) {
  const [selected, setSelected] = useState(selectedValues)
  const subCollections = JSON.parse(window.collectionConfig.subCollections)

  const localSelected = (id, values) => {
    setSelected((prevState) => ({
      ...prevState,
      [id]: values
    }))
  }

  useEffect(() => {
    if (localSelectedValues) {
      localSelectedValues(selected)
    }
  }, [selected])

  return (
    <div className={className}>
      {
        subCollections &&
        subCollections.length > 0 &&
        <AccordionItem
          titleClass="pb-0 lg-max:pt-5 text-base font-body"
          classIcon="text-secondary"
          wrapperClass="pb-5 last:md:border-b-0 lg:border-b lg:first:-mt-5"
          key={subCollections}
          heading='Categories'
          content={
            subCollections.map(subCollection => (
              <a className="block mb-4 text-sm no-underline hover:underline first:mt-5 last:mb-0 text-grey-900" href={subCollection.url}>{subCollection.title}</a>
            ))
          }
          isMaxHeight={false}
        />
      }
      {filters.map((filter) => (
        <AccordionItem
          titleClass="pb-0 pt-5 text-base font-body"
          classIcon="text-secondary"
          wrapperClass="pb-5 last:border-b-0 lg:border-b last:pb-0 accordion-plp-filter lg:first:-mt-5"
          key={filter.field}
          defaultActive={selectedValues[filter.field] && selectedValues[filter.field].length}
          filter={filter}
          heading={filter.label}
          content={
            <PlpFilterGroup
              isMobile={isMobile}
              field={filter}
              selectedValues={selectedValues}
              localSelected={localSelected}
              applyFilters={applyFilters}
              onClick={onClick}
            />
          }
          isMaxHeight={false}
          isOverflow={!['slider'].includes(filter.type)}
        />
      ))}
    </div>
  )
}

export default PlpFilterPanel
