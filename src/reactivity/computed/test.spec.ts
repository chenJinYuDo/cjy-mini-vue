import { computed } from "./computed";
import { effect } from "./effect";
import {reactive } from "./reactive";
import { isRef, proxyRefs, ref, unRef } from "./ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  })

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;

    effect(() => {
      calls++;
      dummy = a.value;
    })
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  })

  it("should make nested prpperties reactive", () => {
    const countObj = {
      count: 1,
    }
    const a = ref(countObj);
		let calls = 0;
    let dummy;
    effect(() => {
			calls++;
      dummy = a.value.count;
    })
		expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
		expect(calls).toBe(2);
		// same value should not trigger
    a.value = countObj;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

  })

  it("isRef", () => {
    const a = ref(1);
    const b = reactive({
      a: 1
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  })

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  })

  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "xiaohong",
    };

    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe("xiaohong");
    
    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  })

})

describe("computed", () => {
  it("happy path", () => {
    // ref
    // .value
    // 1.缓存
    const user = reactive({
      age: 1,
    })
    const age = computed(() =>{
      return user.age;
    })
    expect(age.value).toBe(1);
  })

  it("should computed lazily", () => {
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not computed until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not computed again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  })
})