import Service from './Service';

let scope = 'admin/health';

import statuses from '../utils/HealthCheckStatuses';

function status(description, value, type) {
    return {
        description,
        status: {
            value,
            type: type || 0
        }
    }
}

export default class HealthCheckService extends Service {
    /**
     * Возвращает информацию о состоянии компонентов
     * @return {Promise}    then(data)
     * data ~ @see below
     */

    /*
    [ { id, name, lastReloadTime } ]
    */
    getStatus() {
        return this.transport.request(`${scope}`, {}, (response) => {
            const data = response.data;

            let qlikStatus = {
                title: 'Qlik',
                data: [
                    status('System type', data.qlikStatus.systemType),
                    status('Engine address', data.qlikStatus.address),
                    status('Engine version', data.qlikStatus.engineVersion),
                    status('Engine status', data.qlikStatus.error ? data.qlikStatus.error : 'OK',
                        data.qlikStatus.error ? statuses.DANGER : statuses.SUCCESS),
                    //status('QRS status', data.qrsStatus),
                ]
            };

            let boxStatus = {
                title: 'GAP',
                data: [
                    status('Version', data.boxVersion),
                    status('Status', "OK", statuses.SUCCESS),
                ]
            };

            let mongoStatus = {
                title: 'MongoDB',
                data: [
                    status('Host', data.mongoStatus.host),
                    status('Status', data.mongoStatus.status, statuses.SUCCESS),
                ]
            };

            return [qlikStatus, boxStatus, mongoStatus];
        }, 'get', {withCredentials: true})
    }
}