import { Connection as MysqlConnection, ConnectionOptions, createConnection, QueryError } from "mysql2";
import { Observable } from "rxjs";
import { subToCb } from "./_sub-to";

export type ConnectionOptions = ConnectionOptions;
export type QueryError = QueryError;

export function createConnection$(connectionUri: string): Connection;
// tslint:disable-next-line: unified-signatures
export function createConnection$(config: ConnectionOptions): Connection;
export function createConnection$(config: any): Connection {
	return new Connection(createConnection(config));
}

export class Connection {
	constructor(private conn: MysqlConnection) {}

	/**
	 * Error type is `QueryError`
	 */
	connect$(): Observable<void> {
		return new Observable((subscriber) => this.conn.connect(subToCb(subscriber)));
	}

	destroy() {
		this.conn.destroy();
	}
}
