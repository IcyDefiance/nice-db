import { Editor } from "@components/editor";
import { ISafeConnectionOptions } from "@state/conns";
import { getPassword$ } from "@util/keytar-rx";
import { createConnection, RowDataPacket } from "@util/mysql-rx";
import * as React from "react";
import { useObservable, useEventCallback } from "rxjs-hooks";
import { map, switchMap, switchMapTo, withLatestFrom } from "rxjs/operators";
import { Button, Table } from "react-bootstrap";
import { Subject, Observable } from "rxjs";

const run$ = new Subject<void>();

export interface IScreenConnectedProps {
	config: ISafeConnectionOptions;
}

export function ScreenConnected({ config }: IScreenConnectedProps) {
	const [sql$] = React.useState(new Subject<string>());

	const [conn$] = React.useState(
		getPassword$("nIce DB", config.uuid).pipe(
			map((password) => {
				const opts = { ...config, password: password! };
				delete opts.uuid;
				return createConnection(opts);
			}),
		),
	);

	const [rows, fields] = useObservable(() =>
		conn$.pipe(
			switchMap((conn) => run$.pipe(map(() => conn))),
			withLatestFrom(sql$),
			switchMap(([conn, sql]) => conn.query$<RowDataPacket[]>(sql)),
		),
	) || [null, null];

	const [databases] = useObservable(() =>
		conn$.pipe(switchMap((conn) => conn.query$<RowDataPacket[]>("SHOW DATABASES"))),
	) || [null];

	return (
		<>
			<Button variant="secondary" size="sm" onClick={() => run$.next()}>
				Run
			</Button>
			<Editor className="mt-1" onChange={(sql) => sql$.next(sql)} />
			{rows && fields && (
				<Table striped bordered size="sm" className="mt-3">
					<thead>
						<tr>
							{fields.map((field, i) => (
								<th key={i}>{field.name}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, i) => (
							<tr key={i}>
								{fields.map((field, i) => (
									<td key={i}>{row[field.name]}</td>
								))}
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<ul className="mt-3">{databases && databases.map((db, i) => <li key={i}>{db.Database}</li>)}</ul>
		</>
	);
}
