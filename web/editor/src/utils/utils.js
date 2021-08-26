export function getParentDisplayElement (el) {
  if (!el) {
    return null
  }
  if (el.className.indexOf('element-wrapper') > -1) {
    return el
  }
  return getParentDisplayElement(el.parentElement)
}
