import axios from 'axios';

let p = null;
let ENV_CURRENT = process.env.NODE_ENV;
let BASE_URL = 'config/{env}.json';
let http = axios.create();
let Config = {
    data: null,
    rev: 'n/a',
    init() {
        if (!p) {
            p = new Promise((resolve, reject) => {
                return Promise.all([this._loadEnv(ENV_CURRENT), this._loadRev()]).then(([envRespose, revResponse]) => {
                    if (typeof envRespose.data != "object")
                        return reject('Bad config file');
                    this.data = {...envRespose.data};
                    this.rev = revResponse.data.rev;
                    resolve(this.data);
                });
            });
        }
        return p;
    },
    _loadEnv(env) {
        return http.request({
            method: 'get',
            url: BASE_URL.replace('{env}', env)
        });
    },
    _loadRev() {
        return http.get('revision.json');
    }
};
export default Config;