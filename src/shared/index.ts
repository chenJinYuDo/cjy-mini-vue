export function isObject(ele:any){
  return typeof ele === 'object' && typeof ele !== null
}

export const hasOwn = (key:string, value:string)=> Object.prototype.hasOwnProperty.call(value, key);