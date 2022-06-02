
    /** 当前活动effect引用 */
let activeEffect:ReactiveEffect | null = null,
    /** target映射地图 */
    targetMaps:Map<any,any> = new Map();

class ReactiveEffect{
  private _fn: () => void;
  constructor(fn:()=> void){
    this._fn = fn
  }

  run(){
    // 记录当前活动effect
    activeEffect = this;
    this._fn();
  }
}


export function effect(fn:()=> void) {
  const effect = new ReactiveEffect(fn);
  effect.run();
}

/** 收集依赖 */
export function tarck(target: object, key:string | symbol) {
  if(!activeEffect) return;
  /** target 对应的 依赖地图 */
  let depMaps:Map<any,any> = targetMaps.get(target);
  if(!depMaps){
    depMaps = new Map();
    targetMaps.set(target, depMaps);
  }

  /** key 对应依赖集合 */ 
  let deps:Set<ReactiveEffect> = depMaps.get(key);
  if(!deps){
    deps = new Set();
    depMaps.set(key, deps);
  }

  if(!deps.has(activeEffect)){
    /** 添加依赖 */ 
    deps.add(activeEffect)
  }

}

/** 触发依赖 */
export function trigger(target: object, key:string | symbol) {
  const depMaps = targetMaps.get(target);
  const deps = depMaps.get(key);

  for (const _effect of deps) {
    _effect && _effect.run();
  }

} 