import PlpFilterPrice from 'snippets/plp-filter-price/plp-filter-price'
import PlpFilterItems from 'snippets/plp-filter-items/plp-filter-items'

function PlpFilterGroup({ isMobile, field, selectedValues, localSelected, applyFilters, onClick }) {
  return (
    <div className="mt-5">
      {field.type === 'price_range' ? (
        <PlpFilterPrice isMobile={isMobile} field={field} selectedValues={selectedValues} localSelected={localSelected} applyFilters={applyFilters} onClick={onClick} />
      ) : (
        <PlpFilterItems isMobile={isMobile} field={field} selectedValues={selectedValues} localSelected={localSelected} applyFilters={applyFilters} onClick={onClick} />
      )}
    </div>
  )
}

export default PlpFilterGroup
