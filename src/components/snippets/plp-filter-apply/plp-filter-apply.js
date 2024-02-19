function PlpFilterApply({ handleApply }) {
  return (
    <div className="p-4">
      <button type="button" className="button-primary w-full" onClick={handleApply}>
        {translate.collection.apllyFilter}
      </button>
    </div>
  )
}

export default PlpFilterApply
