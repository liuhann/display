import Editor from './Editor.jsx'
import treeData from '../treeData.js'

export default {
  title: 'Editor',
  component: Editor,
  argTypes: {
  }
}

export const Primary = () => {
  return <Editor treeData={treeData} />
}
