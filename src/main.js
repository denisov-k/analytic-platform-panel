import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import Config from './utils/Config';

import Vuikit from 'vuikit';
import VuikitIcons from '@vuikit/icons';
import VueCollapse from 'vue2-collapse';
import Vuelidate from 'vuelidate';

import SessionActions from './store/store-session-actions';
import AuthUtils from './utils/AuthUtils';

import './assets/css/style.less';

Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.use(VueCollapse);
Vue.use(Vuelidate);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  let routeGroups = to.meta.authGroups || [];
  let routeRedirect = to.meta.authRedirect;
  let userGroups = store.state.session.user.groups || [];

  if (AuthUtils.hasGroupsAny(userGroups, routeGroups)) {
    next();
  } else {
    console.warn('User has no permission for route:', to, 'redirecting to:', routeRedirect);
  }
});


router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

Config.init().then(() => {
  store.dispatch(SessionActions.AUTH).then(() => {
    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  })
});