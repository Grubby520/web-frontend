module.exports = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('fulfilled')
    }, 300)
  })
}