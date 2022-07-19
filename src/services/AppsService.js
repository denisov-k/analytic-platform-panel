import Service from './Service';

let scope = 'admin/apps';

export default class AppsService extends Service {
  static app() {
    return {
      _id: '',
      name: '',
      source: {},
      filters: [],
      variables: []
    }
  }

  /**
   * Сохраняет изменения в методе
   * @param {object} methodEntity     сущность метода @see getList()
   * @return {Promise}                вида then(data)
   * data ~ 'ok'
   */

  save(methodEntity) {
    let decorator = ({id, name, expression, type}) => {
      if (type === 'id') {
        return {name, id};
      } else {
        return {name, expression};
      }
    };

    let { _id, source, filters, variables, ...params} = methodEntity;

    params.id = _id;
    params.sourceId = source.id;
    params.variables = variables;
    params.filters = filters.map(decorator);

    return this.transport.request(`${scope}/save`, params, this.defaultResponseHandler, 'post');
  }

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
      return response.data
    });
  }

  /**
   * Возвращает список источников данных
   * @return {Promise}    then(data)
   * data ~ @see below
   */

  /*
  [ { id, name, lastReloadTime } ]
  */
  getSources() {
    return this.transport.request(`${scope}/sources`, {}, (response) => {
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
   * Возвращает список полей
   * @return {Promise}    then(data)
   * data ~ @see below
   */

  /*
  [ { id, name, lastReloadTime } ]
  */
  getFields(sourceId) {
    return this.transport.request(`${scope}/fields?sourceId=${sourceId}`, {}, (response) => {
      return response.data;
    });
  }

  /**
   * Возвращает список переменных
   * @return {Promise}    then(data)
   * data ~ @see below
   */

  /*
  [ { id, name, lastReloadTime } ]
  */
  getVariables(appId) {
    return this.transport.request(`${scope}/variables?appId=${appId}`, {}, (response) => {
      return response.data;
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
      appId
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
  delete(id) {

    let params = {
      id
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