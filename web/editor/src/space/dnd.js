export const onDragEnter = event => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

export const onDrop = dropCallback => {
  return event => {
    event.preventDefault()
    const component = JSON.parse(event.dataTransfer.getData('text/plain'))
    const containerRect = event.currentTarget.getBoundingClientRect()
    dropCallback(containerRect, component, event)
  }
}
