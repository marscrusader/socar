// Checks to see if its default JS iso date YYYY-MM-DDTHH:MN:SS.MSSZ
export const isIsoString = (isoStr) => (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoStr))
