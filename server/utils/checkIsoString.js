export const isIsoString = (isoStr) => {
  // Checks to see if its default JS iso date YYYY-MM-DDTHH:MN:SS.MSSZ
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoStr)) return false
  const date = new Date(isoStr)
  return date.toISOString() === isoStr
}
