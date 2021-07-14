import { DATA_DISPLAY_ELEMENT_ID } from '../const'
export function getParentDisplayElement (el) {
  if (!el) {
    return null
  }
  if (el.hasAttribute(DATA_DISPLAY_ELEMENT_ID)) {
    return el
  }
  return getParentDisplayElement(el.parentElement)
}
