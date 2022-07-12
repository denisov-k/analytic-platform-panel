import Service from './Service';
import Config from "../utils/Config";

let scope = 'admin/users';

export default class UsersService extends Service {

    static userEntity() {
        return {
            _id: '',
            email: '',
            username: '',
            directory: '',
            password: '',
            isAdmin: false,
            groups: []
        }
    }

    /**
     * Возвращает юзера тек. сессии
     * @return {Promise}    then(data)
     * data ~ @see userEntity()
     */
    getCurrent() {
        let callback = function (response) {
            if (typeof response.data !== 'object')
                document.location.href = Config.data.api.http.loginURL;

            response.data.groups = response.data.groups.map(item => item.name);

            return response.data;
        }

        return this.transport.request(`auth/info`, {}, callback, 'get');
    }

    /**
     * Возвращает список пользователей
     * @return {Promise}    then(data)
     * data ~ @see userEntity()
     */
    getList() {
        return this.transport.request(`${scope}/list`, {}, (response) => {
            let users = response.data.map((elem) => {
                elem.roles = Array.isArray(elem.roles) ? elem.roles : [];
                elem.createdAt = new Date(elem.createdAt)//(new Date(elem.createdAt)).toLocaleDateString();

                return elem;
            }).sort(function (a, b) {
                return a.username > b.username ? 1 : -1;
            });
            return users;
        });
    }

    /**
     * Создает/Обновляет юзера, в зависимости от наличия _id != ''
     * @param {object} entity @see userEntity()
     * @return {Promise}    then(data)
     * data ~ <id>
     */
    save(entity) {
        let {_id, ...params} = entity;
        if (_id !== '') {
            params.id = _id;
        }

        params.groups = params.groups.map(item => {
            return item._id
        });

        return this.transport.request(`${scope}/save`, params, (response) => {
            return {
                _id: response.data._id,
                username: response.data.username,
                directory: response.data.directory,
                isAdmin: response.data.isAdmin,
                groups: response.data.groups,
                createdAt: new Date(response.data.createdAt)
            }
        }, 'post');
    }

    /**
     * Удаляет пользователя по id
     * @param {string} userId
     * @return {Promise}    then(data)
     */
    delete(userId) {
        let params = {
            ids: [userId]
        };
        return this.transport.request(`${scope}/delete`, params, this.defaultResponseHandler, 'post');
    }

    /**
     * Возвращает список ролей
     * @return {Promise}    then(data)
     */
    /*getGroupsList() {
        return new Promise((resolve) => {
            resolve(['admin_tech', 'admin_business']);
        })
    }*/
}