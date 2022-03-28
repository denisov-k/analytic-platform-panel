import Vue from 'vue'
import Router from 'vue-router'
import Header from './layouts/Header';
import Aside from './layouts/Aside';
import AsideBlank from './layouts/AsideBlank';
import UsersService from './services/UsersService';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        header: Header,
        aside: Aside,
        default: () => import(/* webpackChunkName: "view-home" */ '@/views/Home.vue')
      },
      meta: {
        title: 'Главная',
        description: '',
        viewTitle: '',
        viewDescription: '',
        icon: '',
        visible: true,
        authGroups: [],
        authRedirect: {'name': 'home'}
      },
      children: [],
    },
    {
      path: '/apps',
      name: 'apps',
      components: {
        header: Header,
        aside: Aside,
        default: () => import(/* webpackChunkName: "view-apps" */ '@/views/Apps.vue')
      },
      meta: {
        title: 'Приложения',
        description: 'В данном разделе вы можете управлять перезагрузкой и обновлением приложений. Приложения используются в качестве источника данных в системе',
        viewTitle: 'Список приложений',
        viewDescription: '',
        icon: 'i/i-apps.svg',
        visible: true,
        authGroups: [],
        authRedirect: {'name': 'home'}
      },
      children: [],
    },
    {
      path: '/users',
      name: 'users',
      components: {
        header: Header,
        aside: Aside,
        default: () => import(/* webpackChunkName: "view-users" */ '@/views/Users.vue')
      },
      meta: {
        title: 'Пользователи',
        description: 'В данном разделе вы можете управлять пользователями административной панели и их правами доступа',
        viewTitle: 'Список пользователей',
        viewDescription: '',
        icon: 'i/i-users.svg',
        visible: true,
        authGroups: [],
        authRedirect: {'name': 'home'}
      },
      children: [],
    },
    {
      path: '/endpoints',
      name: 'endpoints',
      components: {
        header: Header,
        aside: Aside,
        default: () => import(/* webpackChunkName: "view-api-methods" */ '@/views/Endpoints.vue')
      },
      meta: {
        title: 'Методы API',
        description: 'В данном разделе вы можете создавать, удалять и редактировать методы API. Методы используются для передачи данных между системами',
        viewTitle: 'Управление методами API',
        viewDescription: '',
        icon: 'i/i-api.svg',
        visible: true,
        authGroups: [],
        authRedirect: {'name': 'home'}
      },
      children: [],
    },
    {
      path: '/groups',
      name: 'groups',
      components: {
        header: Header,
        aside: Aside,
        default: () => import(/* webpackChunkName: "view-api-methods" */ '@/views/Groups.vue')
      },
      meta: {
        title: 'Группы',
        description: 'В данном разделе вы можете создавать, удалять и редактировать группы и их фильтры для данных',
        viewTitle: 'Управление группами',
        viewDescription: '',
        icon: 'i/i-api.svg',
        visible: true,
        authGroups: [],
        authRedirect: {'name': 'home'}
      },
      children: [],
    }
  ]
})
