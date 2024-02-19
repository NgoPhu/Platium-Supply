import { render } from 'preact'
import { useState, useEffect } from 'preact/hooks'

export const SearchNotice = () => {
  const [display, setDisplay] = useState(false)
  const urlParams = new URLSearchParams(window.location.search)
  const oq = urlParams.get('oq')
  const q = urlParams.get('q')

  const originalQuery = () => {
    if (oq && q) {
      urlParams.delete('oq')
      urlParams.set('q', oq)
      return `/search?${urlParams.toString()}`
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (oq && q) {
      oq === q ? setDisplay(false) : setDisplay(true)
    }
  }, [])

  return (
    display && (
      <div className="mt-2 text-center">
        <span>We couldn’t find {`“${oq}“`}. Take a look at our closest results, or </span>
        <a href={originalQuery()} className="link normal-case">
          search for {`“${oq}“`}
        </a>
      </div>
    )
  )
}

render(<SearchNotice />, document.getElementById('search-notice'))
