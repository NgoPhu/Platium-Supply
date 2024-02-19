function ProgressBar({ customStyles, className = 'relative flex justify-start h-2 w-full rounded-[14px] bg-[#DEDEDE] mt-2' }) {
  return (
    <div className={className}>
      <div className="absolute left-0 h-full w-full origin-left rounded-[14px] bg-secondary transition-transform" style={customStyles}></div>
    </div>
  )
}

export default ProgressBar
