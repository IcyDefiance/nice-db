import { join } from "path";
import { from, Observable, of, Subject } from "rxjs";
import { catchError, delayWhen, first, map, merge, shareReplay, switchMap, tap } from "rxjs/operators";
import * as uuidv4 from "uuid/v4";
import { mkdir$, readFile$, writeFile$ } from "../util/fs-rx";
import { deletePassword$, setPassword$ } from "../util/keytar-rx";
import { ConnectionOptions } from "../util/mysql-rx";

const outFile = join(__dirname, ".state/conns.json");
const updateSubj = new Subject<ISafeConnectionOptions[]>();

export interface ISafeConnectionOptions extends ConnectionOptions {
	password: undefined;
	uuid: string;
}

export const conns$: Observable<ISafeConnectionOptions[]> = readFile$(outFile).pipe(
	catchError(() => of("[]")),
	map((str) => JSON.parse(str.toString())),
	merge(updateSubj),
	shareReplay(1),
);

const connsNow$ = conns$.pipe(first());

export function addConn$(config: ConnectionOptions, rememberPassword: boolean): Observable<ISafeConnectionOptions[]> {
	const uuid = uuidv4();

	let obs$;
	if (config.password && rememberPassword) {
		obs$ = setPassword$("nIce DB", uuid, config.password);
	} else {
		obs$ = from([undefined]);
	}

	return obs$.pipe(
		delayWhen(() => mkdir$(join(__dirname, ".state"))),
		catchError(() => of(null)),
		switchMap(() => connsNow$),
		map((conns) => [...conns, { ...config, password: undefined, uuid }]),
		delayWhen(update$),
	);
}

export function delConn$(index: number): Observable<ISafeConnectionOptions[]> {
	return connsNow$.pipe(
		delayWhen((conns) => deletePassword$("nIce DB", conns[index].uuid)),
		map((conns) => [...conns.slice(0, index), ...conns.slice(index + 1)]),
		delayWhen(update$),
	);
}

function update$(conns: ISafeConnectionOptions[]): Observable<void> {
	return writeFile$(outFile, JSON.stringify(conns)).pipe(tap(() => updateSubj.next(conns)));
}
