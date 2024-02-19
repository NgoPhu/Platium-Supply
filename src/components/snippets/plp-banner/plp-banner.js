function PlpBanner({ className, classItem, banners }) {
  return (
    banners &&
    banners.length > 0 && (
      <div className={className}>
        {banners.map((banner) => (
          <div dangerouslySetInnerHTML={{ __html: banner }} className={classItem}></div>
        ))}
      </div>
    )
  )
}

export default PlpBanner
