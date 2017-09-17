const createValuePlaceholders = function (start, count) {
  const valuePlaceholders = []
  for (let i = start; i<start + count; i++) {
    valuePlaceholders.push('$'+i)
  }
  return valuePlaceholders
}

module.exports = {
  createValuePlaceholders
}
