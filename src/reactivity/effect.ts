/** 当前活动effect引用 */
let activeEffect: ReactiveEffect | null = null,
  /** 是否应该收集 */
  shouldEffect = false,
  /** target映射地图 */
  targetMaps: Map<any, any> = new Map();

export interface ReactiveEffectRunner<T = any> {
  (): T;
  _effect: ReactiveEffect;
}

interface EffectOptions {
  scheduler?: () => void;
  onStop?:() => void;
}

export class ReactiveEffect<T = any> {
  private _fn: () => T;
  deps: Set<ReactiveEffect>[] = [];
  protected active = true;
  protected onStop?: ()=> void
  // 接受调度器变量
  constructor(fn: () => T, public scheduler?: () => void) {
    this._fn = fn;
  }

  run(): any {
    activeEffect = this;
    if (this.active) {
      // 记录当前活动effect
      shouldEffect = true;
      const result = this._fn();
      shouldEffect = false;
      return result;
    }
    return this._fn();
  }

  stop() {
    if (this.active) {
      // 要清除当前effect的所有依赖的引用
      this.active = false;
      this.deps.map((dep) => {
        dep.delete(this);
      });
      this.onStop && this.onStop();
    }
  }
}

export function effect<T = any>(fn: () => T, options?: EffectOptions) {
  const effect = new ReactiveEffect<T>(fn, options?.scheduler);
  extend(effect, options);
  effect.run();
  const runner = effect.run.bind(effect) as ReactiveEffectRunner;
  runner._effect = effect;
  return runner;
}



/** 收集依赖 */
export function tarck(target: object, key: any) {
  // if (!activeEffect || !shouldEffect) return;
  if(!isTarcking()) return;
  
  /** target 对应的 依赖地图 */
  let depMaps: Map<any, any> = targetMaps.get(target);
  if (!depMaps) {
    depMaps = new Map();
    targetMaps.set(target, depMaps);
  }

  /** key 对应依赖集合 */
  let deps: Set<ReactiveEffect> = depMaps.get(key);
  if (!deps) {
    deps = new Set();
    depMaps.set(key, deps);
  }
  tarckEffect(deps);

}

function isTarcking():boolean {
  return (activeEffect && shouldEffect) as boolean
}

export function tarckEffect(deps:Set<ReactiveEffect>){
  if(isTarcking()) {
    if (!deps.has(activeEffect as ReactiveEffect)) {
      /** 添加依赖 */
      deps.add(activeEffect as ReactiveEffect);
      /** 反向收集依赖 */
      activeEffect?.deps.push(deps);
    }
  }

}

/** 触发依赖 */
export function trigger(target: object, key: any) {
  const depMaps = targetMaps.get(target);
  const deps = depMaps.get(key);

  triggerEffect(deps)
}

export function triggerEffect(deps:Set<ReactiveEffect>){
  for (const _effect of deps) {
    // 有调度器执行调度器
    if (_effect.scheduler) {
      _effect.scheduler();
    } else {
      _effect && _effect.run();
    }
  }
}



/** 停止effect */
export function stop<T = any>(runner: ReactiveEffectRunner<T>) {
  runner._effect.stop();
}


const  extend = (target:any, source:any) => Object.assign(target, source)
