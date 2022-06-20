import { createApp } from '../../lib/mini-vue-esm.js';
import  App from './app.js'; 
const container = document.querySelector('#app');
createApp(App).mount(container)