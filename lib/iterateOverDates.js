const iterateOverDates = (start, end, cb) => {
  const diff = end.diff(start, 'days')
  if (diff < 0) return

  for (let i = 0; i <= diff; i++) {
    cb(start.clone().add(i, 'days'))
  }
}

module.exports = iterateOverDates
