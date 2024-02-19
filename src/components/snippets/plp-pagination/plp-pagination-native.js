import Icon from 'snippets/icon/icon'

function PlpPaginationNav({ isLoading, pagination, goToPage }) {
  const handleClick = (page) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    goToPage([page])
  }

  if (isLoading) {
    return (
      <div className="mt-6 skeleton animate-pulse lg:mt-10 lg:pb-12">
        <div className="flex items-center justify-center">
          {[...Array(6)].map(() => (
            <div className="mx-2 h-10 w-10 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
          ))}
        </div>
      </div>
    )
  }
  return (
    pagination &&
    pagination.pages.length > 1 && (
      <div className="flex flex-col items-center justify-center mt-7 lg:mt-12 plp-pagination">
        <nav className="flex items-center -space-x-px isolate" aria-label="Pagination">
          <button
            className="relative flex items-center justify-center w-10 h-10 p-2 mr-2 text-sm rounded-full bg-grey-300 focus:z-20 disabled:opacity-[0.35]"
            disabled={pagination.currentPage === 1}
            onClick={() => handleClick(pagination.currentPage - 1)}
          >
            <span className="sr-only">{translate.collection.previousPagination}</span>
            <Icon viewBox="0 0 16 16" name="icon-chevron-back-outline" className="w-4 h-4 text-secondary" />
          </button>
          {pagination.pages.map((page) => (
            <button
              className={`relative flex h-10 w-10 items-center justify-center rounded-full p-2 !mr-2 text-sm font-bold font-sans focus:z-20
                ${
                  page === pagination.currentPage
                    ? 'z-10 bg-secondary text-white'
                    : 'bg-grey-300 text-grey-900 hover:bg-secondary hover:text-white'
                }
                ${page === '...' ? 'pointer-events-none' : ''}
              `}
              onClick={() => handleClick(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="relative flex items-center justify-center w-10 h-10 p-2 text-sm rounded-full bg-grey-300 focus:z-20 disabled:opacity-[0.35]"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handleClick(pagination.currentPage + 1)}
          >
            <span className="sr-only">{translate.collection.nextPagination}</span>
            <Icon viewBox="0 0 16 16" name="icon-chevron-forward-outline" className="w-4 h-4 text-secondary" />
          </button>
        </nav>
      </div>
    )
  )
}

export default PlpPaginationNav
