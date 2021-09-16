import Vue from 'vue';
import VueCustomElement from 'vue-custom-element';
import 'document-register-element/build/document-register-element';
import App from './App.vue';

Vue.use(VueCustomElement);
Vue.customElement('weather-widget', (new App().$options));
