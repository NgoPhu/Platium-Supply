import { useEffect } from 'preact/hooks'

const useDisabledSubmitFormWithEnter = (ref) => {
  useEffect(() => {
    const inputRef = ref.current
    if (inputRef) {
      const handleKeydown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
        }
      }

      inputRef.addEventListener('keydown', handleKeydown)
      return () => {
        inputRef.removeEventListener('keydown', handleKeydown)
      }
    }
  }, [ref])
}

export default useDisabledSubmitFormWithEnter
