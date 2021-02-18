export const checkEmptyFields = (fieldsArr) => {
  // this function is to check for empty values
  return fieldsArr.includes(undefined) || fieldsArr.includes(null) || fieldsArr.includes('')
}
