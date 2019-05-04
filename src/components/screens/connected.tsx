import { Editor } from "@components/editor";
import { ISafeConnectionOptions } from "@state/conns";
import { getPassword$ } from "@util/keytar-rx";
import { createConnection, RowDataPacket, FieldPacket, QueryError } from "@util/mysql-rx";
import * as React from "react";
import { Button, Table } from "react-bootstrap";
import { Subject, of, combineLatest } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { map, switchMap, withLatestFrom, catchError, delayWhen } from "rxjs/operators";
import { tuple } from "@util/tuple";

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

	const [rows, fields, err] = useObservable(() =>
		combineLatest(conn$, sql$).pipe(
			delayWhen(() => run$),
			switchMap(([conn, sql]) =>
				conn.query$<RowDataPacket[]>(sql).pipe(
					map(([rows, fields]) => tuple(rows, fields, null)),
					catchError((err: QueryError) => of(tuple(null, null, err.message))),
				),
			),
		),
	) || [null, null, null];

	return (
		<>
			<Button variant="secondary" size="sm" onClick={() => run$.next()}>
				Run
			</Button>
			<Editor className="mt-1" onChange={(sql) => sql$.next(sql)} />
			<div className="text-danger">{err}</div>
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
		</>
	);
}
