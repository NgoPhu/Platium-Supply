import { formatName, formatRangePrice } from 'helpers/utils'
import { Fragment } from 'preact'

function PlpFilterGroupSelected({ values, field }) {
  return (
    <div>
      {field === 'ss_price' ? (
        <div className="text-sm font-normal tracking-normal text-grey-900">{formatRangePrice(values)}</div>
      ) : (
        <Fragment>
          {values &&
            values.length > 0 &&
            values.map((item, index) => (
              <span className="pr-1 text-sm font-normal tracking-normal text-grey-900">
                {formatName(item)}
                {index < values.length - 1 && ','}
              </span>
            ))}
        </Fragment>
      )}
    </div>
  )
}

export default PlpFilterGroupSelected
