import Price from 'snippets/price/price'

function ButtonATCDisabled({ text, price }) {
  return (
    <button type="button" className="relative w-full uppercase button-outlined button-large md:w-1/2" disabled>
      {text} - <Price className="inline" price={price} />
    </button>
  )
}

export default ButtonATCDisabled
