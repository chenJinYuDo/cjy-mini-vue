import { effect, ReactiveEffect, ReactiveEffectRunner } from "./effect"

class ComputedImpl {
  private _getter: any
  private _effect:ReactiveEffect
  private dirty = true
  private _value = null
  constructor(getter:()=> any){
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, ()=>{
      if(!this.dirty){
        this.dirty = true;
      }
    });
  }

  get value(){
    if(this.dirty){
      this._value = this._effect.run();
      this.dirty = false
    }
    return this._value;
  }
}


export function computed<T>(fn:() => T){
  return new ComputedImpl(fn)
}