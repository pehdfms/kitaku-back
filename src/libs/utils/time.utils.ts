export const oneSecond = 1000
export const oneMinute = 60 * oneSecond
export const oneHour = 60 * oneMinute
export const oneDay = 24 * oneHour

export const isOlderThan = (a: Date, b: number) => {
  const comparisonTime = Date.now() - b
  return a.getTime() < comparisonTime
}
