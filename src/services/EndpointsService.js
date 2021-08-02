import Service from './Service';
import Config from "@/utils/Config";

let scope = 'admin/endpoints';

export default class EndpointsService extends Service {

    static methodEntity() {
        return {
            _id: '',
            path: '',
            appId: '',
            app: {},
            rowLimit: 10000,
            enabled: true,
            anonymousAccess: false,
            suppressZero: false,
            sectionAccess: false,
            dimensions: [],
            measures: [],
            filters: []
        }
    }

    static methodDimensionEntity() {
        return {
            id: '',
            name: '',
            expression: '',
            type: ''
        }
    }

    static methodMeasureEntity() {
        return {
            id: '',
            name: '',
            expression: '',
            type: ''
        }
    }

    static methodFilterEntity() {
        return {
            id: '',
            name: '',
            expression: '',
            type: ''
        }
    }

    /**
     * Возвращает список методов
     * @return {Promise}    вида then(data)
     * data ~ @see below
     */

    /*
    [
    {
        "rowLimit":10000,
        "dimensions":[
            { "name":"entity_name", "expression":"=$(=$(vCurrentDimensionName))" },
            { "name":"type", "expression":"=if(getselectedcount([Сотрудники.Код]) = 0, 'structure', 'person')" }
        ],
        "measures":[ { "name":"entity_name", "expression":"=$(=$(vCurrentDimensionName))" } ],
        "filters":[ { "name":"entity_name", "expression":"=$(=$(vCurrentDimensionName))" } ],
        "enabled":true,
        "dynamicDimensions":true,
        "_id":"5c17ec3822c4ce310c1b68b3",
        "path":"rt/profile_info",
        "appId":"18effe1e-c98d-4540-86ef-2e3608143239",
    }
    ]
    */
    getList() {
        let decorator = (elem) => {
            elem.type = (elem.id == null) ? 'expression' : 'id';
            elem.expression = (elem.expression != null) ? elem.expression : '';
            elem.id = (elem.id != null) ? elem.id : '';
            return elem;
        };
        let filter = (elem) => elem != null;
        let handler = (response) => {
            response.data.forEach((elem) => {
                elem.url = `${Config.data.api.http.baseURL}/api/${elem.path}`;
                elem.dimensions = elem.dimensions.filter(filter).map(decorator);
                elem.measures = elem.measures.filter(filter).map(decorator);
                elem.filters = elem.filters.filter(filter).map(decorator);
            });
            return response.data;
        }
        return this.transport.request(`${scope}/list`, {}, handler);
    }

    /**
     * Возвращает список полей
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    getFields(appId) {
        return this.transport.request(`admin/apps/fields?appId=${appId}`, {}, (response) => {
            return response.data;
        });
    }

    /**
     * Создает новый метод
     * @param {string} appId    id приложения @see AppsService.getList()
     * @param {string} path     путь метода @example 'myapi/method'
     * @return {Promise}        вида then(data)
     * data ~ id приложения
     */
    create(appId, path) {
        let params = {
            appId: appId,
            path: path
        };
        return this.transport.request(`${scope}/create`, params, (response) => response.data.id, 'post')
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
        let {appId, _id, dimensions, measures, filters, ...params} = methodEntity;
        params.id = _id;
        params.appId = appId;
        params.dimensions = dimensions.map(decorator);
        params.measures = measures.map(decorator);
        params.filters = filters.map(decorator);
        return this.transport.request(`${scope}/save`, params, this.defaultResponseHandler, 'post');
    }

    /**
     * Удаляет метод
     * @param {string} methodId         id метода @see getList()
     * @return {Promise}                вида then(data)
     * data ~ 'ok'
     */
    delete(methodId) {
        let params = {
            id: methodId
        };
        return this.transport.request(`${scope}/delete`, params, this.defaultResponseHandler, 'post');
    }
}