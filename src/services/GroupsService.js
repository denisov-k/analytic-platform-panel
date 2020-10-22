import Service from './Service';

let scope = 'admin/groups';

export default class GroupsService extends Service {
    /**
     * Возвращает список групп
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    getList() {
        return this.transport.request(`${scope}/list`, {}, (response) => {
            return response.data;
        });
    }

    create(name) {
        return this.transport.request(`${scope}/create`, {name}, (response) => {
            return response.data.id;
        }, 'post');
    }

    edit(id, name, filters) {
        return this.transport.request(`${scope}/save`, {id, name, filters}, (response) => {
            return response.data;
        }, 'post');
    }

    delete(id) {
        return this.transport.request(`${scope}/delete`, {id}, (response) => {
            return response.data;
        }, 'post');
    }
}