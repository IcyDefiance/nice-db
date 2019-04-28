import { MakeDirectoryOptions, mkdir, PathLike, readFile, writeFile, WriteFileOptions } from "fs";
import { Observable } from "rxjs";
import { subToCb } from "./_sub-to";

export function mkdir$(path: PathLike, options?: string | number | MakeDirectoryOptions | null): Observable<void> {
	return new Observable((subscriber) => mkdir(path, options, subToCb(subscriber)));
}

export function readFile$(
	path: string | number | Buffer | URL,
	options?: { encoding?: null; flag?: string },
): Observable<Buffer>;
export function readFile$(
	path: string | number | Buffer | URL,
	options: string | { encoding: string; flag?: string },
): Observable<string>;
export function readFile$(
	path: string | number | Buffer | URL,
	options: string | { encoding?: string; flag?: string },
): Observable<string | Buffer>;
export function readFile$(
	path: string | number | Buffer | URL,
	options?: string | { encoding?: string | null; flag?: string },
): Observable<string | Buffer> {
	return new Observable((subscriber) => readFile(path, options, subToCb(subscriber)));
}

export function writeFile$(
	path: string | number | Buffer | URL,
	data: any,
	options?: WriteFileOptions,
): Observable<void> {
	return new Observable((subscriber) => writeFile(path, data, options || {}, subToCb(subscriber)));
}
