export function isObject(ele:any){
  return typeof ele === 'object' && typeof ele !== null
}

export const hasOwn = (key:string, value:string)=> Object.prototype.hasOwnProperty.call(value, key);

export function camelize(str:string){
  return str.replace(/-([a-z])/g, (_, c)=>{
    return c ? c.toUpperCase() : ''
  })
} 

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toHandlerKey(str:string){
  return str ? 'on' + capitalize(str) : '';
}