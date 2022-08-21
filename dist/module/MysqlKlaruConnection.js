"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlKlaruConnection = void 0;
const mysql2_1 = require("mysql2");
class MysqlKlaruConnection {
    constructor() {
    }
    get connection() {
        return this._connection;
    }
    connect(ip, port, user, password, database, callback) {
        this._config = {
            ip,
            user,
            password,
            database,
            port
        };
        this._connection = (0, mysql2_1.createConnection)({
            host: ip,
            user,
            password,
            database,
            port
        });
        this._connection.connect((err) => __awaiter(this, void 0, void 0, function* () {
            if (err)
                throw err;
            else
                callback();
        }));
    }
    anyReq() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Trying to ping");
                    this.connection.ping((x) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`x: ${x}`);
                        if (x) {
                            this._connection.destroy();
                            this._connection = (0, mysql2_1.createConnection)({
                                host: this._config.ip,
                                user: this._config.user,
                                password: this._config.password,
                                database: this._config.database,
                                port: this._config.port
                            });
                        }
                        resolve(null);
                    }));
                }
                catch (error) {
                    console.error(error);
                    resolve(null);
                }
            }));
        });
    }
    reqRaw(query) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            yield this.anyReq();
            try {
                this.connection.query(query, (err, rows) => {
                    if (err)
                        throw err;
                    if ((!rows) || !Array.isArray(rows))
                        return resolve(null);
                    return resolve(rows);
                });
            }
            catch (error) {
                console.error(error);
                resolve(null);
            }
        }));
    }
    reqQuery(query, ...opts) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.anyReq();
                this.connection.query(query, opts, (err, rows) => {
                    if (err)
                        throw err;
                    resolve(rows.length == 0 ? null : rows);
                });
            }
            catch (error) {
                console.error(error);
                resolve(null);
            }
        }));
    }
}
exports.MysqlKlaruConnection = MysqlKlaruConnection;
//# sourceMappingURL=MysqlKlaruConnection.js.map