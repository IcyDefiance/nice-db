import { Editor } from "@components/editor";
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
		map((password) => {
			const opts = { ...config, password: password! };
			delete opts.uuid;
			return createConnection(opts);
		}),
	);

	const [databases] = useObservable(() =>
		conn$.pipe(switchMap((conn) => conn.query$<RowDataPacket[]>("SHOW DATABASES"))),
	) || [null];

	return (
		<>
			<Editor />
			<ul className="mt-3">{databases && databases.map((db, i) => <li key={i}>{db.Database}</li>)}</ul>
		</>
	);
}
