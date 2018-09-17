export const noop = () => undefined

const getIcon = node => {
  if (node.children) return node.open ? 'folder-open' : 'folder'
  else return 'file-alt'
}

const getHeader = node => node.name

const getMeta = noop

export default {
  getIcon,
  getHeader,
  getMeta,
}
