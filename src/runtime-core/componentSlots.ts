export function initSlots(instance:any, slots:any){
  instance.slots = Array.isArray(slots) ? slots : [slots]
}