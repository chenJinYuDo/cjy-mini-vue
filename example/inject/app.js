import { h , provider, inject} from '../../lib/mini-vue-esm.js';

const Provider = {
  name: "Provider",
  setup(){
    provider("foo","fooVal");
    provider("bar","barVal");
  },
  render(){
    return h("div", {}, [h(Provider2)])
  }
}

const Provider2 = {
  name: "Provider2",
  setup(){
    provider("foo", "fooVal2"),
    provider("two", "two");
    const foo = inject('foo');
    return {
      foo
    }
  },
  render(){
    return h("div", {}, [h("p",{},"Provider" + this.foo), h(Consumer)])
  }
}

const Consumer = {
  name:"Consumer",
  setup(){
    const foo = inject("foo");
    const bar = inject("bar");
    const two = inject("two");
    const no = inject("no");
    console.log('%c [ no ]-36', 'font-size:13px; background:pink; color:#bf2c9f;', no)

    return {
      foo,
      bar,
      two
    }
  },
  render(){
    return h("div",{},`Consumer: - ${this.foo} - ${this.bar} - ${this.two}`)
  }
}


export default {
  name: 'app',
  render() {
    return h('div', {}, [ h(Provider) ])
  },
  setup(){

  }
}