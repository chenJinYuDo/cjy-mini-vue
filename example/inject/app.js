import { h , provider, inject} from '../../lib/mini-vue-esm.js';

const Provider = {
  name: "Provider",
  setup(){
    provider("foo","fooVal");
    provider("bar","barVal");
  },
  render(){
    return h("div", {}, [h("p",{},"Provider"),h(Consumer)])
  }
}

const Consumer = {
  name:"Consumer",
  setup(){
    const foo = inject("foo");
    const bar = inject("bar");
    return {
      foo,
      bar
    }
  },
  render(){
    return h("div",{},`Consumer: - ${this.foo} - ${this.bar}`)
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