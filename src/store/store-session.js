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
            state.user = { ...state.user, ...user };
        },
        [Mutations.AUTH_ERROR](state, err) {
            state.status = 'error'
        },
    },
    actions: {
        [Actions.AUTH](context) {
            return new Promise((resolve, reject) => {

                let service = new UsersService();
                service.getCurrent().then((user) => {
                    context.commit(Mutations.SET_USER, user);
                    resolve();
                }).catch((err) => {
                    reject(err);
                })
            });
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