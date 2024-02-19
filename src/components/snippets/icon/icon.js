function Icon(props) {
  const className = props.className ? `icon ${props.className}` : 'icon'
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox={props.viewBox} fill="none">
      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`#${props.name}`} x="0" y="0" />
    </svg>
  )
}

export default Icon
