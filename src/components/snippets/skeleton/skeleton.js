function Skeleton() {
  return (
    <div role="status" class="w-full animate-pulse py-6">
      <div class="flex w-full items-center justify-between">
        <div className="w-full">
          <div class="mb-2 h-6 w-full bg-grey-400"></div>
          <div class="h-4 w-2/3 bg-grey-400"></div>
        </div>
      </div>
    </div>
  )
}

function SkeletonLine(number = 1) {
  return (
    <div role="status" class="flex w-full animate-pulse flex-col gap-2">
      {[...Array(number)].map(() => (
        <div className="h-6 bg-gray-200" />
      ))}
    </div>
  )
}

function SkeletonProduct(number = 1) {
  return [...Array(number)].map(() => (
    <div className="flex animate-pulse flex-col">
      <div class="relative mb-2 md:mb-4">
        <div className="aspect-square relative w-full bg-grey-400 pb-[100%]"></div>
      </div>
      <div class="mb-3 flex-1">
        <div className="h-6 w-2/3 bg-grey-400"></div>
      </div>
      <div class="flex flex-col items-start">
        <div className="mb-2 h-4 w-1/3 bg-grey-400"></div>
        <div className="mt-2 h-4 w-1/2 bg-grey-400"></div>
      </div>
    </div>
  ))
}

export { Skeleton, SkeletonLine, SkeletonProduct }
