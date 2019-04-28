import * as path from "path";
import { Observable, of, Subject } from "rxjs";
import { catchError, delayWhen, first, map, merge, shareReplay, switchMap, tap } from "rxjs/operators";
import * as fs from "../util/fs-rx";
import * as mysql from "../util/mysql-rx";

const connsFile = path.join(__dirname, ".state/conns.json");

const connsUpdate = new Subject<mysql.ConnectionOptions[]>();

export const conns$: Observable<mysql.ConnectionOptions[]> = fs.readFile(connsFile).pipe(
	catchError(() => of("[]")),
	map((str) => JSON.parse(str.toString())),
	merge(connsUpdate),
	shareReplay(1),
);

export function addConn(config: mysql.ConnectionOptions): Observable<mysql.ConnectionOptions[]> {
	return fs.mkdir(path.join(__dirname, ".state")).pipe(
		catchError(() => of(null)),
		switchMap(() => conns$),
		first(),
		map((conns) => [...conns, config]),
		delayWhen((conns) => fs.writeFile(connsFile, JSON.stringify(conns))),
		tap((conns) => connsUpdate.next(conns)),
	);
}

export function delConn(index: number): Observable<mysql.ConnectionOptions[]> {
	return conns$.pipe(
		first(),
		map((conns) => conns.splice(index, 1)),
		delayWhen((conns) => fs.writeFile(connsFile, JSON.stringify(conns))),
		tap((conns) => connsUpdate.next(conns)),
	);
}
