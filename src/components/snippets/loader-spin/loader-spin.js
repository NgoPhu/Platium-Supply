function LoaderSpin({ show = true, width = 5, height = 5, wrapperClass = 'bg-white', spinClass = 'border-t-primary' }) {
  return (
    show && (
      <div className={`fit flex-center z-20 ${wrapperClass}`}>
        <div className={`relative w-${width} h-${height}`}>
          <div className={`fit animate-spin rounded-full border-2 border-grey-100 ${spinClass}`}></div>
        </div>
      </div>
    )
  )
}

export default LoaderSpin
