import { Connection } from "mysql2";
export declare class MysqlKlaruConnection {
    private _connection;
    private _config;
    get connection(): Connection;
    constructor();
    connect(ip: string, port: number, user: string, password: string, database: string, callback: () => any): void;
    private anyReq;
    reqRaw(query: string): Promise<any[]>;
    reqQuery(query: string, ...opts: any[]): Promise<any>;
}
