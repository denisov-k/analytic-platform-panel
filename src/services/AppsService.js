import Service from './Service';

let scope = 'admin/apps';

export default class AppsService extends Service {
    /**
     * Загружает приложение
     * @param {object} entity @see userEntity()
     * @return {Promise}    then(data)
     * data ~ <id>
     */
    upload(request) {
        let {file, name} = request;

        let params = {
            "app-name": name,
            "app-file": file
        };

        var formData = new FormData();
        formData.append("app-name", name);
        formData.append("app-file", file);

        return this.transport.request(`${scope}/upload`, formData, (response) => {
            //console.log(response)
            return response
        }, 'post', {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
    }

    /**
     * Возвращает список приложений
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    getList() {
        return this.transport.request(`${scope}/list`, {}, (response) => {
            return response.data.map((elem) => {
                return {
                    id: elem.qDocId,
                    name: elem.qDocName,
                    lastReloadTime: elem.qLastReloadTime,
                    stream: elem.qMeta.stream ? elem.qMeta.stream.name : ''
                }
            });
        });
    }

    /**
     * Начинает процесс перезагрузки приложения
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    startReload(appId) {

        let params = {
            appID: appId
        };

        return this.transport.request(`${scope}/reload`, params, (response) => {
            return response.data
        }, 'post');
    }

    /**
     * Удаляет приложения
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    delete(appId) {

        let params = {
            appID: appId
        };

        return this.transport.request(`${scope}/delete`, params, (response) => {
            return response.data
        }, 'post');
    }

    getScript(appId) {
        let params = {
            appId: appId
        };

        return this.transport.request(`${scope}/script`, params, (response) => {
            return response.data
        }, 'get');
    }

    setScript(appId, script) {
        let params = {
            appId,
            script
        };

        return this.transport.request(`${scope}/script`, params, (response) => {
            return response.data
        }, 'post');
    }
}