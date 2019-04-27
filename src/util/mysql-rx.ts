import * as mysql from "mysql2";
import { Observable } from "rxjs";
import { cbToRxjs } from "./_callback-to-rxjs";

export type ConnectionOptions = mysql.ConnectionOptions;
export type QueryError = mysql.QueryError;

export function createConnection(connectionUri: string): Connection;
// tslint:disable-next-line: unified-signatures
export function createConnection(config: mysql.ConnectionOptions): Connection;
export function createConnection(config: any): Connection {
	return new Connection(mysql.createConnection(config));
}

export class Connection {
	constructor(private conn: mysql.Connection) {}

	/**
	 * Error type is `QueryError`
	 */
	connect(): Observable<void> {
		return new Observable((subscriber) => this.conn.connect(cbToRxjs(subscriber)));
	}

	destroy() {
		this.conn.destroy();
	}
}
