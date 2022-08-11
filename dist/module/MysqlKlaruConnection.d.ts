import { Connection } from "mysql2";
export default class MysqlKlaruConnection {
    private _connection;
    get connection(): Connection;
    constructor();
    connect(ip: string, port: number, user: string, password: string, database: string, callback: () => any): void;
    private anyReq;
    requestRaw(query: string): Promise<any[]>;
    reqQuery(query: string, ...opts: any[]): Promise<any>;
}
