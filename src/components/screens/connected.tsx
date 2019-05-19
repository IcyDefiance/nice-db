import { Editor } from "@components/editor";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Button from "@material/react-button";
import { ISafeConnectionOptions } from "@state/conns";
import { getPassword$ } from "@util/keytar-rx";
import { createConnection, QueryError, RowDataPacket, Connection } from "@util/mysql-rx";
import { tuple } from "@util/tuple";
import * as React from "react";
import { combineLatest, of, Subject } from "rxjs";
import { useObservable } from "rxjs-hooks";
import { catchError, delayWhen, map, switchMap } from "rxjs/operators";

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
		<div className="h-100 d-flex flex-column">
			<div className="p-3">
				<Button dense onClick={() => run$.next()}>
					Run
				</Button>
				<Editor className="mt-1" onChange={(sql) => sql$.next(sql)} />
			</div>
			<div className="pt-2" style={{ maxHeight: "33%" }}>
				<div className="text-danger">{err}</div>
				{rows && fields && (
					<Table>
						<TableHead>
							<TableRow>
								{fields.map((field, i) => (
									<TableCell key={i}>{field.name}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row, i) => (
								<TableRow key={i}>
									{fields.map((field, i) => (
										<TableCell key={i}>{row[field.name]}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
