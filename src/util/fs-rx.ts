import * as fs from "fs";
import { Observable } from "rxjs";
import { cbToRxjs } from "./_callback-to-rxjs";

export function mkdir(path: fs.PathLike, options?: string | number | fs.MakeDirectoryOptions | null): Observable<void> {
	return new Observable((subscriber) => fs.mkdir(path, options, cbToRxjs(subscriber)));
}

export function readFile(
	path: string | number | Buffer | URL,
	options?: { encoding?: null; flag?: string },
): Observable<Buffer>;
export function readFile(
	path: string | number | Buffer | URL,
	options: string | { encoding: string; flag?: string },
): Observable<string>;
export function readFile(
	path: string | number | Buffer | URL,
	options: string | { encoding?: string; flag?: string },
): Observable<string | Buffer>;
export function readFile(
	path: string | number | Buffer | URL,
	options?: string | { encoding?: string | null; flag?: string },
): Observable<string | Buffer> {
	return new Observable((subscriber) => fs.readFile(path, options, cbToRxjs(subscriber)));
}

export function writeFile(
	path: string | number | Buffer | URL,
	data: any,
	options?: fs.WriteFileOptions,
): Observable<void> {
	return new Observable((subscriber) => fs.writeFile(path, data, options || {}, cbToRxjs(subscriber)));
}
