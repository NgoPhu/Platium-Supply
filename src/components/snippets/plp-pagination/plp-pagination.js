import { useMemo } from 'preact/hooks'
import LoaderSpin from 'snippets/loader-spin/loader-spin'

function PlpPagination({ isLoading, pagination, goToPage }) {
  const textResult = useMemo(() => {
    if (pagination && pagination.end && pagination.totalResults) {
      return translate.collection.showItems.replace('{{ pagination_end }}', pagination.end).replace('{{ totalResults }}', pagination.totalResults)
    }
  }, [pagination])

  const gapResult = useMemo(() => pagination && pagination.totalResults - pagination.end, [pagination])
  const loadMoreText = translate.collection.loadMore.replace('{{ result }}', gapResult && gapResult > pagination.perPage ? pagination.perPage : gapResult)

  return (
    pagination &&
    pagination.totalResults > pagination.perPage && (
      <div className="flex flex-col items-center justify-center p-6 md:py-12">
        {pagination && (
          <div>
            <p className="text-sm">{textResult}</p>
            {gapResult !== 0 && (
              <button type="button" className="button-outlined mt-2 min-w-[164px]" onClick={() => goToPage([pagination.nextPage])}>
                {!isLoading ? loadMoreText : <LoaderSpin />}
              </button>
            )}
          </div>
        )}
      </div>
    )
  )
}

export default PlpPagination
