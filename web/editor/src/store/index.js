function counterReducer (state = { pageConfig: {}, elements: [] }, action) {
  switch (action.type) {
    case 'element/insert':
      state.elements.push(action.payload)
      return { pageConfig: state.pageConfig, elements: state.elements }
    case 'element/update':
      return { pageConfig: state.pageConfig, elements: state.elements }
    case 'element/remove':
      return { value: state.value + 1 }
    case 'counter/decremented':
      return { value: state.value - 1 }
    default:
      return state
  }
}

export default counterReducer
