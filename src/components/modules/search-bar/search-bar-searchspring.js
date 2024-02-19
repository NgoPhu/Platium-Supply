import appState from 'modules/search-bar/@store'
import { createContext } from 'preact'
import { useContext, useMemo } from 'preact/hooks'
import debounce from 'lodash.debounce'
import SearchDropdown from 'snippets/search-dropdown/search-dropdown'
import { selectAll, removeClass, addClass } from 'helpers/dom'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import useDetectBreakpoint from 'uses/useDetectBreakpoint'

let devtools
if (process.env.NODE_ENV === 'development') {
  devtools = require('preact/devtools')
}

const selectors = {
  searchBarClass: '.js-search-bar',
  searchDropDownClass: '.js-search-dropdown',
  searchOpenedClass: 'is-search-opened'
}

const AppState = createContext()

function SearchBar(props) {
  return (
    <AppState.Provider value={appState()}>
      <App slot={props} />
    </AppState.Provider>
  )
}

function App(props) {
  const state = useContext(AppState)
  const { isMobile } = useDetectBreakpoint()

  const originalQuery = useMemo(() => state.originalQuery.value, [state.originalQuery.value])
  const isOpenDropdown = useMemo(() => state.isOpenDropdown.value, [state.isOpenDropdown.value])
  const searchUrl = useMemo(() => {
    let newUrl = `/search?q=${encodeURIComponent(state.originalQuery.value)}`
    if (state.searchValue.value && state.searchValue.value !== state.originalQuery.value) {
      newUrl = `/search?q=${encodeURIComponent(state.searchValue.value)}&oq=${encodeURIComponent(state.originalQuery.value)}&spell=1`
    }
    if (state.searchValue.value && state.correctedQuery.value && state.correctedQuery.value !== state.searchValue.value) {
      newUrl = `/search?q=${encodeURIComponent(state.correctedQuery.value)}&oq=${encodeURIComponent(state.searchValue.value)}&spell=1`
    }
    return newUrl
  }, [state.originalQuery.value, state.searchValue.value, state.correctedQuery.value])

  const searchBarEl = selectAll(selectors.searchBarClass)

  const search = debounce((e) => {
    const currentValue = e.target.value
    state.setOriginalQuery(currentValue)
    if (currentValue.length) {
      state.getSuggestion(currentValue)
    } else {
      state.closeDropdown()
    }
  }, 500)

  const closeSearch = () => {
    state.setOriginalQuery(null)
    state.closeDropdown()
    clearAllBodyScrollLocks()
    searchBarEl.forEach((el) => {
      removeClass(selectors.searchOpenedClass, el)
    })
  }

  const onSearch = (e) => {
    e.preventDefault()
    window.location.href = searchUrl
  }

  const onOpen = (e) => {
    setTimeout(() => {
      e.target.nextElementSibling.focus()
    }, 300)
    searchBarEl.forEach((el) => {
      addClass(selectors.searchOpenedClass, el)
      isMobile && disableBodyScroll(el)
    })
  }

  return (
    <div className="search-bar top-[var(--header-offset-top)] left-0 z-10 flex max-h-[calc(100%_-_var(--header-offset-top))] w-full flex-col bg-white md:top-0 [.is-sticky_&]:xl:px-6 [.is-search-opened_&]:md-max:fixed">
      <form
        action={searchUrl}
        className="flex-items-center search-bar__form z-20 md:rounded-full md:bg-grey-100 md:px-4 md:py-2 [.is-search-opened_&]:p-4"
        onSubmit={onSearch}
      >
        <button type="submit" className="text-grey-900" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-miterlimit="10" stroke-width="1.8" d="M8.636 2.5a6.136 6.136 0 1 0 0 12.273 6.136 6.136 0 0 0 0-12.273Z" />
            <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.8" d="m13.214 13.215 4.286 4.286" />
          </svg>
        </button>
        <label for="searchbar" class="absolute inset-0 cursor-pointer bg-white md:hidden [.is-sticky_&]:xl:block [.is-search-opened_&]:hidden" onClick={onOpen}>
          <svg class="icon pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-miterlimit="10" stroke-width="1.8" d="M8.636 2.5a6.136 6.136 0 1 0 0 12.273 6.136 6.136 0 0 0 0-12.273Z" />
            <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="1.8" d="m13.214 13.215 4.286 4.286" />
          </svg>
        </label>
        <input
          id="searchbar"
          type="text"
          className="js-search-bar-input mx-2 flex-1 border-none bg-transparent p-0 text-grey-900 placeholder-grey-700 focus:shadow-0 focus:outline-none"
          value={originalQuery}
          placeholder={props.slot.placeholder}
          onInput={search}
        />
        <button type="button" className={`hidden md-max:block ${isOpenDropdown && '!block'} search-bar__close`} onClick={closeSearch} aria-label="search close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" class="pointer-events-none h-4 w-4">
            <path
              id="icon-close-outline"
              d="M13.333 13.333 2.667 2.667M13.333 2.667 2.667 13.333"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </form>
      {isOpenDropdown && <SearchDropdown state={state} closeSearch={closeSearch}></SearchDropdown>}
    </div>
  )
}

export default SearchBar
