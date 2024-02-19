import { setCookie, getCookie } from '@convertdigital/gamma-cookie'
import { v4 as uuidv4 } from 'uuid'

const SEARCHSPRING_KEY = '_isuid'

export default () => {
  const currentUid = getCookie(SEARCHSPRING_KEY)
  if (!currentUid) {
    const createUuid = () => {
      return uuidv4()
    }
    setCookie(SEARCHSPRING_KEY, createUuid())
  }
}
