export default standardLatest => {
  const result = []
  for (const pkg of standardLatest) {
    const packageInfo = {
      packageName: pkg.name,
      packageLabel: pkg.description,
      preview: `https://www.unpkg.com/${pkg.name}@${pkg.version}/${pkg.preview}`,
      components: []
    }

    for (const com of pkg.components) {
      packageInfo.components.push(Object.assign({}, com, {
        pkg: pkg.name,
        preview: `https://www.unpkg.com/${pkg.name}@${pkg.version}/${com.preview}`
      }))
    }
    result.push(packageInfo)
  }
  console.log('standard latest', standardLatest, result)
  return result
}
