import * as path from "path";
import { Observable, of, Subject } from "rxjs";
import { catchError, delayWhen, first, map, merge, shareReplay, switchMap, tap } from "rxjs/operators";
import * as fs from "../util/fs-rx";
import * as mysql from "../util/mysql-rx";

const outFile = path.join(__dirname, ".state/conns.json");
const updateSubj = new Subject<mysql.ConnectionOptions[]>();

export const conns$: Observable<mysql.ConnectionOptions[]> = fs.readFile(outFile).pipe(
	catchError(() => of("[]")),
	map((str) => JSON.parse(str.toString())),
	merge(updateSubj),
	shareReplay(1),
);

const connsNow$ = conns$.pipe(first());

export function addConn$(config: mysql.ConnectionOptions): Observable<mysql.ConnectionOptions[]> {
	return fs.mkdir(path.join(__dirname, ".state")).pipe(
		catchError(() => of(null)),
		switchMap(() => connsNow$),
		map((conns) => [...conns, config]),
		delayWhen(update$),
	);
}

export function delConn$(index: number): Observable<mysql.ConnectionOptions[]> {
	return connsNow$.pipe(
		map((conns) => [...conns.slice(0, index), ...conns.slice(index + 1)]),
		delayWhen(update$),
	);
}

function update$(conns: mysql.ConnectionOptions[]): Observable<void> {
	return fs.writeFile(outFile, JSON.stringify(conns)).pipe(tap(() => updateSubj.next(conns)));
}
