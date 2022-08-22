import {Connection, createConnection} from "mysql2";

export class MysqlKlaruConnection{
    private _connection: Connection;
    private _config: IMySqlKlaruConnectionOptions;
    get connection(){
        return this._connection;
    }
    constructor() {

    }
    public connect(ip: string, port: number, user: string, password: string, database: string, callback: () => any): void{
        this._config = {
            ip,
            user,
            password,
            database,
            port
        };
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
                //console.log("Trying to ping")
                this.connection.ping(async x => {
                    //console.log(`x: ${x}`)
                    if (x) {
                        this._connection.destroy();
                        this._connection = createConnection({
                            host: this._config.ip,
                            user: this._config.user,
                            password: this._config.password,
                            database: this._config.database,
                            port: this._config.port
                        })
                    }
                    resolve(null);
                })
            } catch(error) {console.error(error); resolve(null); }
            
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
            } catch(error) {console.error(error); resolve(null); }
            
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
            } catch(error) {console.error(error); resolve(null); }
            
        })
    
    }
}


interface IMySqlKlaruConnectionOptions{
    ip: string;
    user: string;
    password: string;
    database: string;
    port: number;
}