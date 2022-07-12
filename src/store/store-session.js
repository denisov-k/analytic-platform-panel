import Actions from './store-session-actions';
import Mutations from './store-session-mutations';
import UsersService from './../services/UsersService';
import Config from "../utils/Config";

const Session = {
  state: {
    user: {},
    status: '',
  },
  mutations: {
    [Mutations.SET_USER](state, user) {
      state.user = {...state.user, ...user};
    },
    [Mutations.AUTH_ERROR](state, err) {
      state.status = 'error'
    },
  },
  actions: {
    [Actions.AUTH](context) {
        let service = new UsersService();

        return service.getCurrent().then((user) => {

          if (user.isAdmin) {
            context.commit(Mutations.SET_USER, user);
          } else {
            document.body.innerHTML = 'Access denied';
          }

        }).catch((err) => {
          const authURL = Config.data.api.http.loginURL + '?redirect=' + encodeURIComponent(window.location.href);

          if (!err.response)
            document.body.innerHTML = err.message;
          else if (err.response.status === 401)
            window.location.href = authURL;
        })
    },
    [Actions.LOGOUT](context, baseURL) {
      window.location.href = Config.data.api.http.logoutURL
    }
  },
  getters: {
    authStatus: state => state.status,
  }
}
export default Session;