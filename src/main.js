import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
import Config from './utils/Config';
import Vuikit from 'vuikit';
import VuikitIcons from '@vuikit/icons';
import VueCollapse from 'vue2-collapse';
import Vuelidate from 'vuelidate';
import VueTooltip from 'vue-directive-tooltip';
import SessionActions from './store/store-session-actions';
import AuthUtils from './utils/AuthUtils';
import ElementUI from 'element-ui';


import 'vue-directive-tooltip/src/css/index.scss';
import './assets/css/style.less';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.use(VueCollapse);
Vue.use(Vuelidate);
Vue.use(VueTooltip, {
	delay: 0,
	placement: 'top',
	class: 'tooltip',
	triggers: ['hover', 'focus'],
	offset: 0
});
Vue.config.productionTip = false;

// access check
router.beforeEach((to, from, next) => {
	let routeRoles = to.meta.authRoles;
	let routeRedirect = to.meta.authRedirect;
	let userRoles = store.state.session.user.roles;

	if (!userRoles) {
		console.warn('User has no permission for route:', to, 'redirecting to:', routeRedirect);
		return;
	}

	if (AuthUtils.hasRolesAll(userRoles, routeRoles)) {
		next();
	} else {
		console.warn('User has no permission for route:', to, 'redirecting to:', routeRedirect);
		router.push(routeRedirect);
	}
});

// title set
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
	}).catch(() => {
		store.dispatch(SessionActions.LOGOUT, Config.data.api.http.baseURL)
	})
});