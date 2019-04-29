import { ISafeConnectionOptions } from "@state/conns";
import { getPassword$ } from "@util/keytar-rx";
import { createConnection, RowDataPacket } from "@util/mysql-rx";
import * as React from "react";
import { useObservable } from "rxjs-hooks";
import { map, switchMap } from "rxjs/operators";

export interface IScreenConnectedProps {
	config: ISafeConnectionOptions;
}

export function ScreenConnected({ config }: IScreenConnectedProps) {
	const conn$ = getPassword$("nIce DB", config.uuid).pipe(
		map((password) => createConnection({ ...config, password: password! })),
	);

	const [databases] = useObservable(() =>
		conn$.pipe(switchMap((conn) => conn.query$<RowDataPacket[]>("SHOW DATABASES"))),
	) || [null];

	return <ul>{databases && databases.map((db) => <li>{db.Database}</li>)}</ul>;
}
