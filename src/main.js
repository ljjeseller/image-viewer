import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
// import './libs/initializeAria2'
import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    icon: 'info',
    duration : 3000,
});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
