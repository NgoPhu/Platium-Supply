function PlpFilterSkeleton() {
  return (
    <div className="w-full px-8 py-2">
      {[1, 2, 3, 4].map((index) => (
        <div role="status" className={`w-full animate-pulse py-6 ${index !== 4 ? 'border-b' : ''}`}>
          <div className="flex w-full items-center justify-between">
            <div className="w-full">
              <div className="mb-2 h-6 w-full bg-grey-400"></div>
              <div className="h-4 w-2/3 bg-grey-400"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlpFilterSkeleton
