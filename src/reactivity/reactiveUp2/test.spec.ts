import { isReactive, isReadonly, reactive, readonly, shallowReadonly } from "./reactive";

// 支持 stop 回调
it('happy path', () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  /** observed 和 original 的指向不一样 */
  expect(original).not.toBe(observed);

  /** observed.foo ==> 1 */
  expect(observed.foo).toBe(1);
});

describe('readonly', () => {
	it('happy path', () => {
		const original = { foo: 1, bar: { baz: 2 } };
		const wrapped = readonly(original);
		/** observed 和 original 的指向不一样 */
		expect(wrapped).not.toBe(original);
		expect(wrapped.foo).toBe(1);
	});

	it('warn then call set', () => {
		console.warn = jest.fn();

		const user = readonly({
			age: 10,
		});

		user.age = 11;

		expect(console.warn).toBeCalled();
	});

	test("should not make non-reactive prpperties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1}});
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  })

	it("isReactive", ()=> {
    const original = { foo: 1};
    const observed = reactive(original);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  })
});