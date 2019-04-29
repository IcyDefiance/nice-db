import {
	Connection as MysqlConnection,
	ConnectionOptions,
	createConnection as mysqlCreateConnection,
	QueryError,
	RowDataPacket,
	OkPacket,
	FieldPacket,
} from "mysql2";
import { Observable } from "rxjs";
import { subToCb } from "./_sub-to";
import Query = require("mysql/lib/protocol/sequences/Query");

export type ConnectionOptions = ConnectionOptions;
export type QueryError = QueryError;
export type RowDataPacket = RowDataPacket;

export function createConnection(connectionUri: string): Connection;
// tslint:disable-next-line: unified-signatures
export function createConnection(config: ConnectionOptions): Connection;
export function createConnection(config: any): Connection {
	return new Connection(mysqlCreateConnection(config));
}

export class Connection {
	constructor(private conn: MysqlConnection) {}

	/**
	 * Error type is `QueryError`
	 */
	connect$(): Observable<void> {
		return new Observable((subscriber) => this.conn.connect(subToCb(subscriber)));
	}

	query$<T extends ResultType>(sql: string, values?: any): Observable<[T, FieldPacket[]]>;
	query$<T extends ResultType>(options: Query.QueryOptions, values?: any): Observable<[T, FieldPacket[]]>;
	query$<T extends ResultType>(sql: any, values?: any): Observable<[T, FieldPacket[]]> {
		return new Observable((subscriber) => {
			this.conn.query<T>(sql, values, (err, result, fields) => {
				if (err) {
					subscriber.error(err);
				} else {
					subscriber.next([result, fields]);
					subscriber.complete();
				}
			});
		});
	}

	destroy() {
		this.conn.destroy();
	}
}

type ResultType = RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[];
