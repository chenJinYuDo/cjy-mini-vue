export function initSlots(instance:any, slots:any){
  for (const key in slots) {
    slots[key] = Array.isArray(slots[key]) ? slots[key] : [slots[key]]

  }
  instance.slots = slots
}