import { Fragment, render } from 'preact'
import { useState } from 'preact/hooks'
import QuantityInput from 'snippets/quantity-input/quantity-input'

export const QuantityItem = () => {
  const [quantity, setQuantity] = useState(1)

  return (
    <Fragment>
      <div title="Quantity input" class="w-[130px]">
        <QuantityInput quantity={quantity} min="0" max='10' setQuantity={setQuantity} />
      </div>
    </Fragment>
  )
}

render(<QuantityItem />, document.getElementById('quantity-item'))
