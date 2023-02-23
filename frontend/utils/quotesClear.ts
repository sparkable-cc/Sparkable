
export function quotesClear(value: string){
  if (!value) return;
  return value.replace(/['"]+/g, '')
}