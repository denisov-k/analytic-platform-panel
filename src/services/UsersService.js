import Service from './Service';

let scope = 'admin/users';

export default class UsersService extends Service {

    static get ROLE_ADMIN_TECH() {
        return 'admin_tech';
    }
    static get ROLE_ADMIN_BUSINESS() {
        return 'admin_business';
    }
    static userEntity() {
        return {
            _id: '',
            email: '',
            username: '',
            directory: '',
            isAdmin: false,
            roles: []
        }
    }
    /**
     * Возвращает юзера тек. сессии
     * @return {Promise}    then(data)
     * data ~ @see userEntity()
     */
    getCurrent() {

        var baseurl = this.transport.getBaseUrl();

        let callback = function (response) {
            if (typeof response.data !== 'object')
                document.location.href = baseurl + '/auth/?redirect=' + document.baseURI;
            else
                return response.data;
        }

        return this.transport.request(`auth/info`, {}, callback);
        // @TODO вызов апи нужен здесь вместо заглушки
        /*return new Promise((resolve) => {
            let user = UsersService.userEntity();
            user.roles = [ UsersService.ROLE_ADMIN_BUSINESS, UsersService.ROLE_ADMIN_TECH ];
            resolve(user);
        });*/
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
        let { _id, ...params } = entity;
        if(_id != '') {
            params.id = _id;
        }
        return this.transport.request(`${scope}/save`, params, (response) => response.data.id, 'post');
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
    rolesGetList() {
        return new Promise((resolve) => {
            resolve([ UsersService.ROLE_ADMIN_BUSINESS, UsersService.ROLE_ADMIN_TECH ]);
        })
    }
}