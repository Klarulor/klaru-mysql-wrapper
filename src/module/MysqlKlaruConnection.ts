import {Connection, createConnection} from "mysql2";

export class MysqlKlaruConnection{
    private _connection: Connection;
    get connection(){
        return this._connection;
    }
    constructor() {

    }
    public connect(ip: string, port: number, user: string, password: string, database: string, callback: () => any): void{
        this._connection = createConnection({
            host: ip,
            user,
            password,
            database,
            port
        });
        this._connection.connect(async (err: any) => {
            if (err) throw err;
            else callback();
        });
    }
    private async anyReq(): Promise<void> {
        return new Promise(async resolve => {
            try{
                this.connection.ping(async x => {
                    if (x) {
                        this.connection.destroy();
                        this.connection.connect(z => {
                            if (z) throw z;
                        })
                    }
                })
            }catch{}
            resolve();
        })
    }
    public reqRaw(query: string): Promise<any[]> {
        return new Promise(async resolve => {
            await this.anyReq();
            try {
                this.connection.query(query, (err, rows) => {
                    if (err) throw err;
                    if ((!rows) || !Array.isArray(rows)) return resolve(null);
                    return resolve(rows);
                })
            } catch { }
            resolve(null);
        })
    }
    public reqQuery(query: string, ...opts: any[]): Promise<any> {
        return new Promise(async resolve => {
            try {
                await this.anyReq();
                this.connection.query(query, opts, (err, rows) => {
                    if (err) throw err;
                    resolve((rows as any[]).length == 0 ? null : rows);
                })
            } catch { }
            resolve(null);
        })
    
    }
}